import { IQuery } from '@nestjs/cqrs';
import { IsUUID, validateSync } from 'class-validator';

export class GetEventQuery implements IQuery {
  @IsUUID()
  readonly eventId: string;

  constructor(eventId: string) {
    this.eventId = eventId;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('GetEventQuery validation failed');
    }
  }
}
