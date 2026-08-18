import { BookingId } from '../booking-id';
import { randomUUID } from 'node:crypto';

describe('BookingId', () => {
  it('should generate a valid booking id', () => {
    const bookingId = BookingId.generate();
    expect(bookingId).toBeDefined();
    expect(bookingId.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should create a booking id from a valid string', () => {
    const uuid = randomUUID();
    const bookingId = BookingId.fromString(uuid);
    expect(bookingId.value).toBe(uuid);
  });

  it('should throw an error when creating from an invalid string', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => BookingId.fromString(invalidUuid)).toThrow(
      'Invalid BookingId',
    );
  });

  it('should return true when comparing two identical booking ids', () => {
    const uuid = randomUUID();
    const bookingId1 = BookingId.fromString(uuid);
    const bookingId2 = BookingId.fromString(uuid);
    expect(bookingId1.equals(bookingId2)).toBe(true);
  });

  it('should return false when comparing two different booking ids', () => {
    const bookingId1 = BookingId.generate();
    const bookingId2 = BookingId.generate();
    expect(bookingId1.equals(bookingId2)).toBe(false);
  });
});
