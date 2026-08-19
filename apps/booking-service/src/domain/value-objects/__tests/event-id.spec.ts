import { EventId } from '../event-id';
import { randomUUID } from 'node:crypto';

describe('EventId', () => {
  it('should create an event id from a valid string', () => {
    const uuid = randomUUID();
    const eventId = EventId.fromString(uuid);
    expect(eventId.value).toBe(uuid);
  });

  it('should throw an error when creating from an invalid string', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => EventId.fromString(invalidUuid)).toThrow('Invalid EventId');
  });

  it('should return true when comparing two identical event ids', () => {
    const uuid = randomUUID();
    const eventId1 = EventId.fromString(uuid);
    const eventId2 = EventId.fromString(uuid);
    expect(eventId1.equals(eventId2)).toBe(true);
  });

  it('should return false when comparing two different event ids', () => {
    const eventId1 = EventId.fromString(randomUUID());
    const eventId2 = EventId.fromString(randomUUID());
    expect(eventId1.equals(eventId2)).toBe(false);
  });
});
