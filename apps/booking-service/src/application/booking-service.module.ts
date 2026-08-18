import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { BookingController } from '../presentation/booking.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './command-handlers';
import { queryHandlers } from './query-handlers';
import { eventHandlers } from './event-handlers';
import { OutboxModule } from '../infrastructure/outbox/outbox.module';

const envSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  OTEL_SERVICE_NAME: Joi.string().required(),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().uri().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    CqrsModule.forRoot(),
    InfrastructureModule,
    OutboxModule,
  ],
  controllers: [BookingController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class BookingServiceModule {}
