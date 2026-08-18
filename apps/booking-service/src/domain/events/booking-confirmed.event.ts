import { IBookingDomainEvent } from './types';

export class BookingConfirmedEvent implements IBookingDomainEvent {
  readonly eventType = 'booking.confirmed.v1';

  constructor(
    public readonly bookingId: string,
    public readonly paymentId: string,
    public readonly status: string,
    public readonly version: number,
    public readonly occurredAt: Date,
  ) {}
}
