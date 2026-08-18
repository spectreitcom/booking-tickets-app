import { Injectable } from '@nestjs/common';
import { BookingProcess } from '../../application/ports/booking-process';
import { TransactionClient } from 'apps/booking-service/generated/prisma/internal/prismaNamespace';

@Injectable()
export class PrismaBookingProcess implements BookingProcess {
  async create(
    payload: { sagaId: string; bookingId: string },
    tx: TransactionClient,
  ): Promise<void> {
    await tx.bookingProcess.create({
      data: {
        id: payload.sagaId,
        bookingId: payload.bookingId,
        currentStep: 'RESERVING_SEATS',
        status: 'RUNNING',
      },
    });
  }
}
