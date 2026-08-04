import { Module } from '@nestjs/common';
import { EventsModule } from './endpoints/events/events.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SEATS_SERVICE } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
