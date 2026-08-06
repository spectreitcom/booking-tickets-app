import { CreateEventCommand } from '../create-event.command';

describe('CreateEventCommand', () => {
  it('should instantiate correctly with valid data', () => {
    const name = 'Test Event';
    const command = new CreateEventCommand(name);
    expect(command.name).toBe(name);
  });

  it('should throw an error if name is empty', () => {
    expect(() => new CreateEventCommand('')).toThrow(
      'CreateEventCommand validation failed',
    );
  });

  it('should throw an error if name is too long', () => {
    const longName = 'a'.repeat(121);
    expect(() => new CreateEventCommand(longName)).toThrow(
      'CreateEventCommand validation failed',
    );
  });
});
