import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { BookingRejectedEvent } from '../../../domain/events/booking-rejected.event';
import { BookingRejectedEventHandler } from '../booking-rejected.event-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('BookingRejectedEventHandler', () => {
  let handler: BookingRejectedEventHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      bookingDetailsView: {
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new BookingRejectedEventHandler(prismaService);
  });

  it('should update booking details view with REJECTED status', async () => {
    const bookingId = randomUUID();
    const event = new BookingRejectedEvent(
      bookingId,
      'REJECTED',
      2,
      new Date(),
    );

    const updateSpy = jest.spyOn(prismaService.bookingDetailsView, 'update');
    updateSpy.mockResolvedValue({
      id: randomUUID(),
      bookingId,
      eventId: randomUUID(),
      status: 'REJECTED',
      seatIds: [],
      totalAmount: 100,
      paymentId: null,
    });

    await handler.handle(event);

    expect(updateSpy).toHaveBeenCalledWith({
      where: {
        bookingId,
      },
      data: {
        status: 'REJECTED',
      },
    });
  });

  it('should propagate errors from prisma', async () => {
    const bookingId = randomUUID();
    const event = new BookingRejectedEvent(
      bookingId,
      'REJECTED',
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
