import { AggregateVersion } from '../aggregate-version';

describe('AggregateVersion', () => {
  it('should create version one', () => {
    const version = AggregateVersion.one();
    expect(version._value).toBe(1);
  });

  it('should create version from valid number', () => {
    const version = AggregateVersion.of(5);
    expect(version._value).toBe(5);
  });

  it('should throw an error for non-integer number', () => {
    expect(() => AggregateVersion.of(1.5)).toThrow('Invalid AggregateVersion');
  });

  it('should throw an error for non-positive number', () => {
    expect(() => AggregateVersion.of(0)).toThrow('Invalid AggregateVersion');
    expect(() => AggregateVersion.of(-1)).toThrow('Invalid AggregateVersion');
  });

  it('should return true when comparing two identical versions', () => {
    const v1 = AggregateVersion.of(10);
    const v2 = AggregateVersion.of(10);
    expect(v1.equals(v2)).toBe(true);
  });

  it('should return false when comparing two different versions', () => {
    const v1 = AggregateVersion.of(10);
    const v2 = AggregateVersion.of(11);
    expect(v1.equals(v2)).toBe(false);
  });
});
