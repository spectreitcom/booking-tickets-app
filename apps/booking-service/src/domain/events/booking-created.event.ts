import { IBookingDomainEvent } from './types';
import { BookingSeat } from '../entities/booking-seat';

export class BookingCreatedEvent implements IBookingDomainEvent {
  readonly eventType = 'booking.created.v1';

  constructor(
    public readonly bookingId: string,
    public readonly eventId: string,
    // public readonly customerId: string,
    public readonly seats: BookingSeat[],
    public readonly status: string,
    public readonly version: number,
    public readonly occurredAt: Date,
  ) {}
}
