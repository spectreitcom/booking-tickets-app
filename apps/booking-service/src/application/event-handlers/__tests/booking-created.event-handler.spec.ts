import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { BookingCreatedEvent } from '../../../domain/events/booking-created.event';
import { BookingCreatedEventHandler } from '../booking-created.event-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('BookingCreatedEventHandler', () => {
  let handler: BookingCreatedEventHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      bookingDetailsView: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new BookingCreatedEventHandler(prismaService);
  });

  it('should create booking details view with PENDING status and seat details', async () => {
    const bookingId = randomUUID();
    const eventId = randomUUID();
    const seatId1 = randomUUID();
    const seatId2 = randomUUID();
    const seats = [
      { seatId: seatId1, priceAmount: 100 },
      { seatId: seatId2, priceAmount: 150 },
    ];
    const event = new BookingCreatedEvent(
      bookingId,
      eventId,
      seats,
      'PENDING',
      1,
      new Date(),
    );

    const createSpy = jest.spyOn(prismaService.bookingDetailsView, 'create');
    createSpy.mockResolvedValue({
      id: randomUUID(),
      bookingId,
      eventId,
      status: 'PENDING',
      seatIds: [seatId1, seatId2],
      totalAmount: 250,
      paymentId: null,
    });

    await handler.handle(event);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        eventId,
        status: 'PENDING',
        seatIds: [seatId1, seatId2],
        totalAmount: 250,
        bookingId,
      },
    });
  });

  it('should propagate errors from prisma', async () => {
    const bookingId = randomUUID();
    const eventId = randomUUID();
    const event = new BookingCreatedEvent(
      bookingId,
      eventId,
      [],
      'PENDING',
      1,
      new Date(),
    );

    const error = new Error('Database error');
    jest
      .spyOn(prismaService.bookingDetailsView, 'create')
      .mockRejectedValue(error);

    await expect(handler.handle(event)).rejects.toBe(error);
  });
});
