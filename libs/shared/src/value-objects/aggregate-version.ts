import { IsInt, IsPositive, Min, validateSync } from 'class-validator';

export class AggregateVersion {
  @IsInt()
  @IsPositive()
  @Min(1)
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid AggregateVersion');
    }
  }

  static one() {
    return new AggregateVersion(1);
  }

  static of(value: number) {
    return new AggregateVersion(value);
  }

  get value() {
    return this._value;
  }

  increment() {
    return new AggregateVersion(this._value + 1);
  }

  equals(other: AggregateVersion) {
    return this._value === other._value;
  }
}
