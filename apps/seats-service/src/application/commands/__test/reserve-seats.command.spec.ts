import { ReserveSeatsCommand } from '../reserve-seats.command';
import { randomUUID } from 'node:crypto';

describe('ReserveSeatsCommand', () => {
  it('should instantiate correctly with valid data', () => {
    const seatIds = [randomUUID(), randomUUID()];
    const bookingId = randomUUID();
    const command = new ReserveSeatsCommand(seatIds, bookingId);
    expect(command.seatIds).toEqual(seatIds);
    expect(command.bookingId).toBe(bookingId);
  });

  it('should throw an error if seatIds contains invalid UUID', () => {
    const seatIds = [randomUUID(), 'invalid-uuid'];
    const bookingId = randomUUID();
    expect(() => new ReserveSeatsCommand(seatIds, bookingId)).toThrow(
      'Invalid ReserveSeatsCommand',
    );
  });

  it('should throw an error if bookingId is not a UUID', () => {
    const seatIds = [randomUUID()];
    expect(() => new ReserveSeatsCommand(seatIds, 'invalid-uuid')).toThrow(
      'Invalid ReserveSeatsCommand',
    );
  });
});
