import { CreateEventCommandHandler } from './create-event.command-handler';
import { AddSeatToEventCommandHandler } from './add-seat-to-event.command-handler';
import { ReleaseSeatsCommandHandler } from './release-seats.command-handler';
import { ReserveSeatsCommandHandler } from './reserve-seats.command-handler';

export const commandHandlers = [
  AddSeatToEventCommandHandler,
  CreateEventCommandHandler,
  ReleaseSeatsCommandHandler,
  ReserveSeatsCommandHandler,
];
