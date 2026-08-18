import { GetNotReservedSeatsByIdsQuery } from '../get-not-reserved-seats-by-ids.query';
import { randomUUID } from 'node:crypto';

describe('GetNotReservedSeatsByIdsQuery', () => {
  it('should instantiate correctly with valid UUIDs', () => {
    const seatIds = [randomUUID(), randomUUID()];
    const query = new GetNotReservedSeatsByIdsQuery(seatIds);
    expect(query.seatIds).toBe(seatIds);
  });

  it('should throw an error if seatIds is empty', () => {
    expect(() => new GetNotReservedSeatsByIdsQuery([])).toThrow(
      'GetNotReservedSeatsByIdsQuery validation failed',
    );
  });

  it('should throw an error if seatIds contains invalid UUID', () => {
    expect(() => new GetNotReservedSeatsByIdsQuery(['invalid-uuid'])).toThrow(
      'GetNotReservedSeatsByIdsQuery validation failed',
    );
  });

  it('should throw an error if seatIds is not an array', () => {
    expect(
      () =>
        new GetNotReservedSeatsByIdsQuery(
          'not-an-array' as unknown as string[],
        ),
    ).toThrow('GetNotReservedSeatsByIdsQuery validation failed');
  });
});
