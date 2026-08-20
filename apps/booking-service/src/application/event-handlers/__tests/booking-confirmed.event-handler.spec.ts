import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { BookingConfirmedEvent } from '../../../domain/events/booking-confirmed.event';
import { BookingConfirmedEventHandler } from '../booking-confirmed.event-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('BookingConfirmedEventHandler', () => {
  let handler: BookingConfirmedEventHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      bookingDetailsView: {
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new BookingConfirmedEventHandler(prismaService);
  });

  it('should update booking details view with CONFIRMED status and paymentId', async () => {
    const bookingId = randomUUID();
    const paymentId = randomUUID();
    const event = new BookingConfirmedEvent(
      bookingId,
      paymentId,
      'CONFIRMED',
      2,
      new Date(),
    );

    const updateSpy = jest.spyOn(prismaService.bookingDetailsView, 'update');
    updateSpy.mockResolvedValue({
      id: randomUUID(),
      bookingId,
      eventId: randomUUID(),
      status: 'CONFIRMED',
      seatIds: [],
      totalAmount: 100,
      paymentId,
    });

    await handler.handle(event);

    expect(updateSpy).toHaveBeenCalledWith({
      where: {
        bookingId,
      },
      data: {
        status: 'CONFIRMED',
        paymentId,
      },
    });
  });

  it('should propagate errors from prisma', async () => {
    const bookingId = randomUUID();
    const paymentId = randomUUID();
    const event = new BookingConfirmedEvent(
      bookingId,
      paymentId,
      'CONFIRMED',
      2,
      new Date(),
    );

    const error = new Error('Database error');
    jest
      .spyOn(prismaService.bookingDetailsView, 'update')
      .mockRejectedValue(error);

    await expect(handler.handle(event)).rejects.toBe(error);
  });
});
