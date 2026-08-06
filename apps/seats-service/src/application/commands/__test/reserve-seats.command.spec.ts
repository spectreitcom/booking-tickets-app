import { ReserveSeatsCommand } from '../reserve-seats.command';
import { randomUUID } from 'node:crypto';

describe('ReserveSeatsCommand', () => {
  it('should instantiate correctly with valid data', () => {
    const seatIds = [randomUUID(), randomUUID()];
    const command = new ReserveSeatsCommand(seatIds);
    expect(command.seatIds).toEqual(seatIds);
  });

  it('should throw an error if seatIds contains invalid UUID', () => {
    const seatIds = [randomUUID(), 'invalid-uuid'];
    expect(() => new ReserveSeatsCommand(seatIds)).toThrow(
      'Invalid ReserveSeatsCommand',
    );
  });
});
