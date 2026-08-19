import { BookingCreatedEvent } from './booking-created.event';
import { IEvent } from '@nestjs/cqrs';
import { BookingSeatsReservedEvent } from './booking-seats-reserved.event';
import { BookingConfirmedEvent } from './booking-confirmed.event';
import { BookingRejectedEvent } from './booking-rejected.event';

export interface IBookingDomainEvent extends IEvent {
  readonly eventType: string;
}

export type BookingEvent =
  | BookingCreatedEvent
  | BookingSeatsReservedEvent
  | BookingConfirmedEvent
  | BookingRejectedEvent;

export type BookingEventType =
  Pick<BookingEvent, 'eventType'> extends { eventType: infer U } ? U : never;
