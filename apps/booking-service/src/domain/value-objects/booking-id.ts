import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class BookingId {
  @IsUUID()
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid BookingId');
    }
  }

  static generate() {
    return new BookingId(randomUUID());
  }

  static fromString(value: string) {
    return new BookingId(value);
  }

  get value() {
    return this._value;
  }

  equals(other: BookingId): boolean {
    return this._value === other._value;
  }
}
