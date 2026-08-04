import { CreateEventCommandHandler } from './create-event.command-handler';
import { AddSeatToEventCommandHandler } from './add-seat-to-event.command-handler';

export const commandHandlers = [
  AddSeatToEventCommandHandler,
  CreateEventCommandHandler,
];
