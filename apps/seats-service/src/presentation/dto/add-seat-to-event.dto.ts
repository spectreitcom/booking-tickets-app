import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class AddSeatToEventDto {
  @IsInt()
  @IsPositive()
  readonly price: number;

  @IsUUID()
  readonly eventId: string;
}
