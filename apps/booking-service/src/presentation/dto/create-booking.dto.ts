import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class SeatDto {
  @IsUUID()
  readonly seatId: string;

  @IsInt()
  @IsPositive()
  readonly priceAmount: number;
}

export class CreateBookingDto {
  @IsUUID()
  readonly eventId: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  readonly seats: SeatDto[];

  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly causationId: string;
}
