import { ICommand } from '@nestjs/cqrs';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Type } from 'class-transformer';

class BookingSeatDto {
  @IsUUID()
  readonly seatId: string;

  @IsInt()
  @IsPositive()
  readonly priceAmount: number;
}

export class CreateBookingCommand implements ICommand {
  @IsUUID()
  readonly eventId: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => BookingSeatDto)
  @ValidateNested({ each: true })
  readonly seats: BookingSeatDto[];

  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly causationId: string;

  constructor(
    eventId: string,
    seats: BookingSeatDto[],
    correlationId: string,
    causationId: string,
  ) {
    this.eventId = eventId;
    this.seats = seats;
    this.correlationId = correlationId;
    this.causationId = causationId;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid CreateBookingCommand');
    }
  }
}
