import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../application/ports/booking.repository';
import { TransactionClient } from 'apps/booking-service/generated/prisma/internal/prismaNamespace';
import { Booking } from '../../domain/booking';
import { BookingId } from '../../domain/value-objects/booking-id';
import { EventStore } from '../event-sourcing/event-store';
import { EventToAppend } from '../event-sourcing/types';
import { randomUUID } from 'node:crypto';
import { eventSerializer } from '../event-sourcing/event-serializer';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly prismaService: PrismaService,
  ) {}

  async save(
    booking: Booking,
    tx: TransactionClient,
    metadata: { correlationId: string; causationId?: string; sagaId?: string },
  ): Promise<void> {
    console.log(metadata); // todo;
    const events: EventToAppend[] = booking
      .getUncommittedEvents()
      .map((event) => ({
        eventId: randomUUID(),
        eventVersion: 1,
        eventType: event.eventType,
        data: eventSerializer(event),
        occurredAt: event.occurredAt,
      }));

    await this.eventStore.append(
      {
        streamName: this.getStreamName(booking.getId()),
        events,
        aggregateId: booking.getId().value,
        aggregateType: 'Booking',
        expectedVersion: booking.getVersion().value,
      },
      tx,
    );
  }

  async findById(
    id: BookingId,
    tx?: Prisma.TransactionClient,
  ): Promise<Booking | null> {
    const prisma = tx || this.prismaService;
    const events = await this.eventStore.load(this.getStreamName(id), prisma);
    return Booking.rehydrate(id, events);
  }

  private getStreamName(id: BookingId): string {
    return `booking-${id.value}`;
  }
}
