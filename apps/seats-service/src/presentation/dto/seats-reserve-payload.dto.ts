import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class SeatsReservePayloadDto {
  @IsUUID()
  readonly eventId: string;

  @IsUUID()
  readonly bookingId: string;

  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];
}
