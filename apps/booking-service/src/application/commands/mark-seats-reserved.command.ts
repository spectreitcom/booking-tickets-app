import { ICommand } from '@nestjs/cqrs';

export class MarkSeatsReservedCommand implements ICommand {
  constructor(readonly bookingId: string) {}
}
