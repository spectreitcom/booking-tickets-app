import { BookingEvent } from '../../domain/events/types';
import { BookingCreatedEvent } from '../../domain/events/booking-created.event';
import { BookingConfirmedEvent } from '../../domain/events/booking-confirmed.event';
import { BookingRejectedEvent } from '../../domain/events/booking-rejected.event';
import { BookingSeatsReservedEvent } from '../../domain/events/booking-seats-reserved.event';

export function eventSerializer(event: BookingEvent) {
  if (event instanceof BookingCreatedEvent) {
    return {
      bookingId: event.bookingId,
      eventId: event.eventId,
      seats: event.seats,
      status: event.status,
      version: event.version,
      occurredAt: event.occurredAt,
    };
  } else if (event instanceof BookingConfirmedEvent) {
    return {
      bookingId: event.bookingId,
      paymentId: event.paymentId,
      status: event.status,
      version: event.version,
      occurredAt: event.occurredAt,
    };
  } else if (event instanceof BookingRejectedEvent) {
    return {
      bookingId: event.bookingId,
      status: event.status,
      version: event.version,
      occurredAt: event.occurredAt,
    };
  } else if (event instanceof BookingSeatsReservedEvent) {
    return {
      bookingId: event.bookingId,
      seats: event.seats,
      status: event.status,
      version: event.version,
      totalAmount: event.totalAmount,
      occurredAt: event.occurredAt,
    };
  } else {
    // todo: implement an exhaustive check
    throw new Error('Unknown event type');
  }
}
