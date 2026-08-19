import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class GetNotReservedSeatsByIdsDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];
}
