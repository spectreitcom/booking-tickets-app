import { PaymentId } from '../payment-id';

describe('PaymentId', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';
  const otherValidUuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  it('should create a valid PaymentId', () => {
    const paymentId = PaymentId.of(validUuid);
    expect(paymentId.value).toBe(validUuid);
  });

  it('should throw an error for invalid UUID', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => PaymentId.of(invalidUuid)).toThrow('Invalid PaymentId');
  });

  it('should return the value via the value getter', () => {
    const paymentId = PaymentId.of(validUuid);
    expect(paymentId.value).toBe(validUuid);
  });

  describe('equals', () => {
    it('should return true if values are the same', () => {
      const paymentId1 = PaymentId.of(validUuid);
      const paymentId2 = PaymentId.of(validUuid);
      expect(paymentId1.equals(paymentId2)).toBe(true);
    });

    it('should return false if values are different', () => {
      const paymentId1 = PaymentId.of(validUuid);
      const paymentId2 = PaymentId.of(otherValidUuid);
      expect(paymentId1.equals(paymentId2)).toBe(false);
    });
  });
});
