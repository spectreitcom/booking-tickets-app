import { BookingCreatedEventHandler } from './booking-created.event-handler';
import { BookingSeatsReservedEventHandler } from './booking-seats-reserved.event-handler';
import { BookingRejectedEventHandler } from './booking-rejected.event-handler';
import { BookingConfirmedEventHandler } from './booking-confirmed.event-handler';

export const eventHandlers = [
  BookingCreatedEventHandler,
  BookingSeatsReservedEventHandler,
  BookingRejectedEventHandler,
  BookingConfirmedEventHandler,
];
