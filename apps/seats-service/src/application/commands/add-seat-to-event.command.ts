import { ICommand } from '@nestjs/cqrs';
import { IsInt, IsPositive, IsUUID, validateSync } from 'class-validator';

export class AddSeatToEventCommand implements ICommand {
  @IsUUID()
  readonly eventId: string;

  @IsInt()
  @IsPositive()
  readonly price: number;

  constructor(eventId: string, price: number) {
    this.eventId = eventId;
    this.price = price;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('AddSeatToEventCommand validation failed');
    }
  }
}
