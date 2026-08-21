import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @ArrayNotEmpty()
  @Type(() => SeatDto)
  @ValidateNested({ each: true })
  readonly seats: SeatDto[];

  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly causationId: string;
}
