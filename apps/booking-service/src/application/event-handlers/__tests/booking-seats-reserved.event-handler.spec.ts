import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { BookingSeatsReservedEvent } from '../../../domain/events/booking-seats-reserved.event';
import { BookingSeatsReservedEventHandler } from '../booking-seats-reserved.event-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('BookingSeatsReservedEventHandler', () => {
  let handler: BookingSeatsReservedEventHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      bookingDetailsView: {
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new BookingSeatsReservedEventHandler(prismaService);
  });

  it('should update booking details view with SEATS_RESERVED status', async () => {
    const bookingId = randomUUID();
    const event = new BookingSeatsReservedEvent(
      bookingId,
      200,
      [],
      'SEATS_RESERVED',
      2,
      new Date(),
    );

    const updateSpy = jest.spyOn(prismaService.bookingDetailsView, 'update');
    updateSpy.mockResolvedValue({
      id: randomUUID(),
      bookingId,
      eventId: randomUUID(),
      status: 'SEATS_RESERVED',
      seatIds: [],
      totalAmount: 200,
      paymentId: null,
    });

    await handler.handle(event);

    expect(updateSpy).toHaveBeenCalledWith({
      where: {
        bookingId,
      },
      data: {
        status: 'SEATS_RESERVED',
      },
    });
  });

  it('should propagate errors from prisma', async () => {
    const bookingId = randomUUID();
    const event = new BookingSeatsReservedEvent(
      bookingId,
      200,
      [],
      'SEATS_RESERVED',
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
