import { AggregateRoot } from '@nestjs/cqrs';
import { BookingId } from './value-objects/booking-id';
import { BookingEvent } from './events/types';
import { InvalidBookingStateTransition, NoSeatsProvided } from './errors';
import { EventId } from './value-objects/event-id';
import { BookingCreatedEvent } from './events/booking-created.event';
import { AggregateVersion } from '@app/shared';
import { BookingStatus } from './value-objects/booking-status';
import { PaymentId } from './value-objects/payment-id';
import { BookingSeat } from './entities/booking-seat';
import { BookingSeatsReservedEvent } from './events/booking-seats-reserved.event';
import { BookingConfirmedEvent } from './events/booking-confirmed.event';
import { BookingRejectedEvent } from './events/booking-rejected.event';

export class Booking extends AggregateRoot<BookingEvent> {
  private id: BookingId;
  private eventId: EventId;
  private version: AggregateVersion;
  private status: BookingStatus;
  private paymentId?: PaymentId;
  private seats: BookingSeat[];

  private constructor(id: BookingId) {
    super();
    this.id = id;
  }

  static create(eventId: string, seats: BookingSeat[]) {
    if (!seats.length) {
      throw new NoSeatsProvided();
    }

    const id = BookingId.generate();
    const _eventId = EventId.fromString(eventId);
    const version = AggregateVersion.one();
    const status = BookingStatus.pending();

    const booking = new Booking(id);

    booking.apply(
      new BookingCreatedEvent(
        id.value,
        _eventId.value,
        seats,
        status.value,
        version.value,
        new Date(),
      ),
    );

    return booking;
  }

  markSeatsReserved() {
    if (this.status.equals(BookingStatus.seatsReserved())) return;

    if (!this.status.equals(BookingStatus.pending())) {
      throw new InvalidBookingStateTransition();
    }

    const totalAmount = this.seats.reduce(
      (acc, seat) => acc + seat.priceAmount,
      0,
    );

    const newVersion = this.version.increment();

    const status = BookingStatus.seatsReserved();

    this.apply(
      new BookingSeatsReservedEvent(
        this.id.value,
        totalAmount,
        this.seats,
        status.value,
        newVersion.value,
        new Date(),
      ),
    );
  }

  confirm(paymentId: PaymentId) {
    if (this.status.equals(BookingStatus.confirmed())) return;

    if (!this.status.equals(BookingStatus.seatsReserved())) {
      throw new InvalidBookingStateTransition();
    }

    const newVersion = this.version.increment();
    const status = BookingStatus.confirmed();

    this.apply(
      new BookingConfirmedEvent(
        this.id.value,
        paymentId.value,
        status.value,
        newVersion.value,
        new Date(),
      ),
    );
  }

  reject() {
    if (this.status.equals(BookingStatus.rejected())) return;

    if (!this.status.equals(BookingStatus.confirmed())) {
      throw new InvalidBookingStateTransition();
    }

    const newVersion = this.version.increment();
    const status = BookingStatus.rejected();

    this.apply(
      new BookingRejectedEvent(
        this.id.value,
        status.value,
        newVersion.value,
        new Date(),
      ),
    );
  }

  getId() {
    return this.id;
  }

  getEventId() {
    return this.eventId;
  }

  getVersion() {
    return this.version;
  }

  getStatus() {
    return this.status;
  }

  getPaymentId() {
    return this.paymentId;
  }

  getSeats() {
    return this.seats;
  }

  private onBookingCreatedEvent(event: BookingCreatedEvent) {
    this.id = BookingId.fromString(event.bookingId);
    this.eventId = EventId.fromString(event.eventId);
    this.version = AggregateVersion.of(event.version);
    this.status = BookingStatus.of(event.status);
    this.seats = event.seats;
  }

  private onBookingConfirmedEvent(event: BookingConfirmedEvent) {
    this.paymentId = PaymentId.of(event.paymentId);
    this.version = AggregateVersion.of(event.version);
    this.status = BookingStatus.of(event.status);
  }

  private onBookingRejectedEvent(event: BookingRejectedEvent) {
    this.version = AggregateVersion.of(event.version);
    this.status = BookingStatus.of(event.status);
  }

  private onBookingSeatsReservedEvent(event: BookingSeatsReservedEvent) {
    this.version = AggregateVersion.of(event.version);
    this.status = BookingStatus.of(event.status);
  }

  static rehydrate(id: BookingId, history: BookingEvent[]) {
    const booking = new Booking(id);
    booking.loadFromHistory(history);
    return booking;
  }
}
