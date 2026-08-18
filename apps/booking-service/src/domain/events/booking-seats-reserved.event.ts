import { IBookingDomainEvent } from './types';
import { BookingSeat } from '../entities/booking-seat';

export class BookingSeatsReservedEvent implements IBookingDomainEvent {
  readonly eventType = 'booking.seats-reserved.v1';

  constructor(
    public readonly bookingId: string,
    public readonly totalAmount: number,
    public readonly seats: BookingSeat[],
    public readonly status: string,
    public readonly version: number,
    public readonly occurredAt: Date,
  ) {}
}
