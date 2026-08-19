import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { BookingProcess } from '../application/ports/booking-process';
import { PrismaBookingProcess } from './prisma/prisma-booking-process';
import { OutboxModule } from './outbox/outbox.module';
import { BookingRepository } from '../application/ports/booking.repository';
import { PrismaBookingRepository } from './prisma/prisma-booking.repository';
import { EventStore } from './event-sourcing/event-store';

@Module({
  imports: [PrismaModule, OutboxModule],
  providers: [
    {
      provide: BookingProcess,
      useClass: PrismaBookingProcess,
    },
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
    EventStore,
  ],
  exports: [PrismaModule, BookingProcess, BookingRepository],
})
export class InfrastructureModule {}
