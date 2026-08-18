import { Booking } from '../../domain/booking';
import { BookingId } from '../../domain/value-objects/booking-id';
import { Prisma } from '../../../generated/prisma/client';

export abstract class BookingRepository {
  abstract save(
    booking: Booking,
    tx: Prisma.TransactionClient,
    metadata: {
      correlationId: string;
      causationId?: string;
      sagaId?: string;
    },
  ): Promise<void>;

  abstract findById(
    id: BookingId,
    tx?: Prisma.TransactionClient,
  ): Promise<Booking | null>;
}
