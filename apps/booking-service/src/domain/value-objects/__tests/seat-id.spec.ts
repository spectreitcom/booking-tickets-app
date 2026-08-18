import { SeatId } from '../seat-id';
import { randomUUID } from 'node:crypto';

describe('SeatId', () => {
  it('should create a seat id from a valid string', () => {
    const uuid = randomUUID();
    const seatId = SeatId.fromString(uuid);
    expect(seatId.value).toBe(uuid);
  });

  it('should throw an error when creating from an invalid string', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => SeatId.fromString(invalidUuid)).toThrow('Invalid SeatId');
  });

  it('should return true when comparing two identical seat ids', () => {
    const uuid = randomUUID();
    const seatId1 = SeatId.fromString(uuid);
    const seatId2 = SeatId.fromString(uuid);
    expect(seatId1.equals(seatId2)).toBe(true);
  });

  it('should return false when comparing two different seat ids', () => {
    const seatId1 = SeatId.fromString(randomUUID());
    const seatId2 = SeatId.fromString(randomUUID());
    expect(seatId1.equals(seatId2)).toBe(false);
  });
});
