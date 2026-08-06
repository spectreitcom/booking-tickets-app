import { AddSeatToEventCommand } from '../add-seat-to-event.command';
import { randomUUID } from 'node:crypto';

describe('AddSeatToEventCommand', () => {
  it('should instantiate correctly with valid data', () => {
    const eventId = randomUUID();
    const price = 100;
    const command = new AddSeatToEventCommand(eventId, price);
    expect(command.eventId).toBe(eventId);
    expect(command.price).toBe(price);
  });

  it('should throw an error if eventId is not a UUID', () => {
    expect(() => new AddSeatToEventCommand('invalid-uuid', 100)).toThrow(
      'AddSeatToEventCommand validation failed',
    );
  });

  it('should throw an error if price is not positive', () => {
    const eventId = randomUUID();
    expect(() => new AddSeatToEventCommand(eventId, 0)).toThrow(
      'AddSeatToEventCommand validation failed',
    );
    expect(() => new AddSeatToEventCommand(eventId, -1)).toThrow(
      'AddSeatToEventCommand validation failed',
    );
  });
});
