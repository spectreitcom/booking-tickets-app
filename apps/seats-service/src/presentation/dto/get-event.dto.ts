import { IsUUID } from 'class-validator';

export class GetEventDto {
  @IsUUID()
  readonly eventId: string;
}
