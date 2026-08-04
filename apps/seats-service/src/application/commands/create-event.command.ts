import { ICommand } from '@nestjs/cqrs';
import { IsNotEmpty, IsString, MaxLength, validateSync } from 'class-validator';

export class CreateEventCommand implements ICommand {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly name: string;

  constructor(name: string) {
    this.name = name;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('CreateEventCommand validation failed');
    }
  }
}
