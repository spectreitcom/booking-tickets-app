import { IBookingDomainEvent } from './types';

export class BookingRejectedEvent implements IBookingDomainEvent {
  readonly eventType = 'booking.rejected.v1';

  constructor(
    public readonly bookingId: string,
    public readonly status: string,
    public readonly version: number,
    public readonly occurredAt: Date,
  ) {}
}
