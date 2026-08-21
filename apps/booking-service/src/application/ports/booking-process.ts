import { Prisma } from '../../../generated/prisma/client';

export abstract class BookingProcess {
  abstract create(
    payload: {
      sagaId: string;
      bookingId: string;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void>;

  abstract chargingPayment(
    payload: {
      bookingId: string;
    },
    tx: Prisma.TransactionClient,
  ): Promise<string>;
}
