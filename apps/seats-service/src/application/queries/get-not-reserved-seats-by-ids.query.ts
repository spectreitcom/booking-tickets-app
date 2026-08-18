import { ArrayNotEmpty, IsArray, IsUUID, validateSync } from 'class-validator';

export class GetNotReservedSeatsByIdsQuery {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];

  constructor(seatIds: string[]) {
    this.seatIds = seatIds;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('GetNotReservedSeatsByIdsQuery validation failed');
    }
  }
}
