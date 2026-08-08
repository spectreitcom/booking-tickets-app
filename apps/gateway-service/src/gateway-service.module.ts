import { Module } from '@nestjs/common';
import { EventsModule } from './endpoints/events/events.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SEATS_SERVICE } from './constants';
import Joi from 'joi';

const envSchema = Joi.object({
  RABBITMQ_URL: Joi.string().required(),
  OTEL_SERVICE_NAME: Joi.string().required(),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().required(),
  OTEL_METRICS_PORT: Joi.number().optional(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        // {
        //   name: BOOKING_SERVICE,
        //   useFactory: (configService: ConfigService) => ({
        //     transport: Transport.RMQ,
        //     options: {
        //       urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
        //       queue: 'booking_queue',
        //       queueOptions: {
        //         durable: false,
        //       },
        //     },
        //   }),
        //   inject: [ConfigService],
        // },
        {
          name: SEATS_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: 'seats_queue',
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    EventsModule,
  ],
})
export class GatewayServiceModule {}
