import { Prisma } from '../../../generated/prisma/client';

export abstract class BookingProcess {
  abstract create(
    payload: {
      sagaId: string;
      bookingId: string;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void>;
}
