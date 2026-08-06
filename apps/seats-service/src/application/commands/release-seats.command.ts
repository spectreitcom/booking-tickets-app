import { ICommand } from '@nestjs/cqrs';
import { IsArray, IsNotEmpty, IsUUID, validateSync } from 'class-validator';

export class ReleaseSeatsCommand implements ICommand {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];

  constructor(seatIds: string[]) {
    this.seatIds = seatIds;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid ReleaseSeatsCommand');
    }
  }
}
