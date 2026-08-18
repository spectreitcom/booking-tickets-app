import { IsUUID, validateSync } from 'class-validator';

export class EventId {
  @IsUUID()
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid EventId');
    }
  }

  static fromString(value: string) {
    return new EventId(value);
  }

  get value() {
    return this._value;
  }

  equals(other: EventId): boolean {
    return this._value === other._value;
  }
}
