import './instrumentation';

import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './application/booking-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsToRpcFilter } from '@app/shared';
import { connect } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { DomainEventDeserializer } from './infrastructure/messaging/domain-event.deserializer';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE ?? 'domain_events';
const BOOKING_QUEUE = 'booking_queue';

async function bindBookingQueueToDomainEvents() {
  const connection = connect([RABBITMQ_URL]);
  const channel = connection.createChannel({
    setup: async (channel: Channel) => {
      await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', {
        durable: true,
      });
      await channel.assertQueue(BOOKING_QUEUE, { durable: true });
      await channel.bindQueue(BOOKING_QUEUE, RABBITMQ_EXCHANGE, 'booking.#.v1');
    },
  });

  await channel.waitForConnect();
  await channel.close();
  await connection.close();
}

async function bootstrap() {
  await bindBookingQueueToDomainEvents();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
        queue: 'booking_queue',
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

bootstrap().catch((err) => console.error(err));
