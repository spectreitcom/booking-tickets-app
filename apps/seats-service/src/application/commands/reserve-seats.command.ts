import { ICommand } from '@nestjs/cqrs';
import { IsArray, IsNotEmpty, IsUUID, validateSync } from 'class-validator';

export class ReserveSeatsCommand implements ICommand {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];

  @IsUUID()
  readonly bookingId: string;

  constructor(seatIds: string[], bookingId: string) {
    this.seatIds = seatIds;
    this.bookingId = bookingId;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid ReserveSeatsCommand');
    }
  }
}
