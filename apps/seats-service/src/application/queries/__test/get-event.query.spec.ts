import { GetEventQuery } from '../get-event.query';
import { randomUUID } from 'node:crypto';

describe('GetEventQuery', () => {
  it('should instantiate correctly with valid data', () => {
    const eventId = randomUUID();
    const query = new GetEventQuery(eventId);
    expect(query.eventId).toBe(eventId);
  });

  it('should throw an error if eventId is not a UUID', () => {
    expect(() => new GetEventQuery('invalid-uuid')).toThrow(
      'GetEventQuery validation failed',
    );
  });
});
