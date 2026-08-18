import { z } from 'zod';

export const bookingCreatedEventSchema = z.object({
  bookingId: z.uuid(),
  eventId: z.uuid(),
  seats: z.array(
    z.object({ seatId: z.uuid(), priceAmount: z.int().positive() }),
  ),
  status: z.string(),
  version: z.int().positive(),
  occurredAt: z.date(),
});

export const bookingConfirmedEventSchema = z.object({
  bookingId: z.uuid(),
  paymentId: z.uuid(),
  status: z.string(),
  version: z.int().positive(),
  occurredAt: z.date(),
});

export const bookingRejectedEventSchema = z.object({
  bookingId: z.uuid(),
  status: z.string(),
  version: z.int().positive(),
  occurredAt: z.date(),
});

export const bookingSeatsReservedEventSchema = z.object({
  bookingId: z.uuid(),
  totalAmount: z.int().positive(),
  seats: z.array(
    z.object({ seatId: z.uuid(), priceAmount: z.int().positive() }),
  ),
  status: z.string(),
  version: z.int().positive(),
  occurredAt: z.date(),
});
