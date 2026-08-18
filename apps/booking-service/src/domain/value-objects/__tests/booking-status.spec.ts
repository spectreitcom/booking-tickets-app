import { BookingStatus } from '../booking-status';

describe('BookingStatus', () => {
  it('should create a pending status', () => {
    const status = BookingStatus.pending();
    expect(status.value).toBe('PENDING');
  });

  it('should create a seats reserved status', () => {
    const status = BookingStatus.seatsReserved();
    expect(status.value).toBe('SEATS_RESERVED');
  });

  it('should create a confirmed status', () => {
    const status = BookingStatus.confirmed();
    expect(status.value).toBe('CONFIRMED');
  });

  it('should create a rejected status', () => {
    const status = BookingStatus.rejected();
    expect(status.value).toBe('REJECTED');
  });

  it('should create a status from a valid string', () => {
    const status = BookingStatus.of('PENDING');
    expect(status.value).toBe('PENDING');
  });

  it('should throw an error for an invalid status string', () => {
    expect(() => BookingStatus.of('INVALID')).toThrow('Invalid BookingStatus');
  });

  it('should throw an error for a status string with wrong casing', () => {
    expect(() => BookingStatus.of('pending')).toThrow('Invalid BookingStatus');
  });

  it('should return true for equal statuses', () => {
    const status1 = BookingStatus.pending();
    const status2 = BookingStatus.pending();
    expect(status1.equals(status2)).toBe(true);
  });

  it('should return false for different statuses', () => {
    const status1 = BookingStatus.pending();
    const status2 = BookingStatus.confirmed();
    expect(status1.equals(status2)).toBe(false);
  });
});
