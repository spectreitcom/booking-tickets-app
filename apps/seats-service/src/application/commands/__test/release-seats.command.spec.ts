import { ReleaseSeatsCommand } from '../release-seats.command';
import { randomUUID } from 'node:crypto';

describe('ReleaseSeatsCommand', () => {
  it('should instantiate correctly with valid data', () => {
    const seatIds = [randomUUID(), randomUUID()];
    const command = new ReleaseSeatsCommand(seatIds);
    expect(command.seatIds).toEqual(seatIds);
  });

  it('should throw an error if seatIds contains invalid UUID', () => {
    const seatIds = [randomUUID(), 'invalid-uuid'];
    expect(() => new ReleaseSeatsCommand(seatIds)).toThrow(
      'Invalid ReleaseSeatsCommand',
    );
  });
});
