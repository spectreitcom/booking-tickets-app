import './instrumentation';

import { NestFactory } from '@nestjs/core';
import { SeatsServiceModule } from './application/seats-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsToRpcFilter } from '@app/shared';
import { connect } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { DomainEventDeserializer } from './infrastructure/messaging/domain-event.deserializer';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE ?? 'domain_events';
const SEATS_QUEUE = 'seats_queue';

async function bindSeatsQueueToDomainEvents() {
  const connection = connect([RABBITMQ_URL]);
  const channel = connection.createChannel({
    setup: async (channel: Channel) => {
      await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', {
        durable: true,
      });
      await channel.assertQueue(SEATS_QUEUE, { durable: true });
      await channel.bindQueue(
        SEATS_QUEUE,
        RABBITMQ_EXCHANGE,
        'seats.reserve.v1',
      );
    },
  });

  await channel.waitForConnect();
  await channel.close();
  await connection.close();
}

async function bootstrap() {
  await bindSeatsQueueToDomainEvents();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SeatsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
        queue: 'seats_queue',
        queueOptions: {
          durable: true,
        },
        deserializer: new DomainEventDeserializer(),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsToRpcFilter());

  await app.listen();
}

bootstrap().catch((e) => console.error(e));
