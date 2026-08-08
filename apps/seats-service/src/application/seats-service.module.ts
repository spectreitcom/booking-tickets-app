import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './command-handlers';
import { SeatsController } from '../presentation/seats.controller';
import { queryHandlers } from './query-handlers';
import Joi from 'joi';

const envSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    CqrsModule.forRoot(),
    InfrastructureModule,
  ],
  controllers: [SeatsController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class SeatsServiceModule {}
