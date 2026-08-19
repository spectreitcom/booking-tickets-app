import { IsUUID, validateSync } from 'class-validator';

export class PaymentId {
  @IsUUID()
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid PaymentId');
    }
  }

  get value() {
    return this._value;
  }

  static of(value: string) {
    return new PaymentId(value);
  }

  equals(other: PaymentId): boolean {
    return this._value === other._value;
  }
}
