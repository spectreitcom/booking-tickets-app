import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class SeatsReservePayloadDto {
  @IsUUID()
  readonly eventId: string;

  @IsUUID()
  readonly bookingId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];
}
