import { StoredEvent } from '../../../generated/prisma/client';
import { BookingEventType } from '../../domain/events/types';
import { z } from 'zod';
import { BookingCreatedEvent } from '../../domain/events/booking-created.event';
import {
  bookingConfirmedEventSchema,
  bookingCreatedEventSchema,
  bookingRejectedEventSchema,
  bookingSeatsReservedEventSchema,
} from '../../domain/events/schemas';
import { BookingConfirmedEvent } from '../../domain/events/booking-confirmed.event';
import { BookingRejectedEvent } from '../../domain/events/booking-rejected.event';
import { BookingSeatsReservedEvent } from '../../domain/events/booking-seats-reserved.event';
import { Logger } from '@nestjs/common';

function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  const logger = new Logger('validateSchema');
  logger.debug(data);

  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    logger.error('validationResult.error', validationResult.error);
    throw new Error('Invalid event data');
  }
  return validationResult.data;
}

export function eventMapper(event: StoredEvent) {
  const logger = new Logger('eventMapper');
  logger.debug(event.eventType);

  switch (event.eventType as BookingEventType) {
    case 'booking.created.v1': {
      const data = validateSchema(bookingCreatedEventSchema, event.eventData);
      return new BookingCreatedEvent(
        data.bookingId,
        data.eventId,
        data.seats,
        data.status,
        data.version,
        data.occurredAt,
      );
    }
    case 'booking.confirmed.v1': {
      const data = validateSchema(bookingConfirmedEventSchema, event.eventData);
      return new BookingConfirmedEvent(
        data.bookingId,
        data.paymentId,
        data.status,
        data.version,
        data.occurredAt,
      );
    }
    case 'booking.rejected.v1': {
      const data = validateSchema(bookingRejectedEventSchema, event.eventData);
      return new BookingRejectedEvent(
        data.bookingId,
        data.status,
        data.version,
        data.occurredAt,
      );
    }
    case 'booking.seats-reserved.v1': {
      const data = validateSchema(
        bookingSeatsReservedEventSchema,
        event.eventData,
      );

      return new BookingSeatsReservedEvent(
        data.bookingId,
        data.totalAmount,
        data.seats,
        data.status,
        data.version,
        data.occurredAt,
      );
    }
    default:
      throw new Error(`Unknown event type: ${event.eventType}`);
  }
}
