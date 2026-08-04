import { NestFactory } from '@nestjs/core';
import { SeatsServiceModule } from './application/seats-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
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
      },
    },
  );

  await app.listen();
}

bootstrap().catch((e) => console.error(e));
