import { CreateBookingCommandHandler } from './create-booking.command-handler';
import { MarkSeatsReservedCommandHandler } from './mark-seats-reserved.command-handler';

export const commandHandlers = [
  CreateBookingCommandHandler,
  MarkSeatsReservedCommandHandler,
];
