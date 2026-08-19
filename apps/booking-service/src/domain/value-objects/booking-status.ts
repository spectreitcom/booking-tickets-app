import { IsIn, validateSync } from 'class-validator';

const BOOKING_STATUS = {
  PENDING: 'PENDING',
  SEATS_RESERVED: 'SEATS_RESERVED',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
};

const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);

export class BookingStatus {
  @IsIn(BOOKING_STATUS_VALUES)
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error('Invalid BookingStatus');
    }
  }

  static of(value: string) {
    return new BookingStatus(value);
  }

  static pending() {
    return new BookingStatus(BOOKING_STATUS.PENDING);
  }

  static seatsReserved() {
    return new BookingStatus(BOOKING_STATUS.SEATS_RESERVED);
  }

  static confirmed() {
    return new BookingStatus(BOOKING_STATUS.CONFIRMED);
  }

  static rejected() {
    return new BookingStatus(BOOKING_STATUS.REJECTED);
  }

  get value() {
    return this._value;
  }

  equals(other: BookingStatus): boolean {
    return this._value === other._value;
  }
}
