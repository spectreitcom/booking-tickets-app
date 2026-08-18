import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { GetNotReservedSeatsByIdsQuery } from '../../queries/get-not-reserved-seats-by-ids.query';
import { GetNotReservedSeatsByIdsQueryHandler } from '../get-not-reserved-seats-by-ids.query-handler';
import { SeatReadModel } from '../read-models/seat.read-model';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('GetNotReservedSeatsByIdsQueryHandler', () => {
  let handler: GetNotReservedSeatsByIdsQueryHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      seat: {
        findMany: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new GetNotReservedSeatsByIdsQueryHandler(prismaService);
  });

  it('should return seat read models when all seats are not reserved', async () => {
    const seatId1 = randomUUID();
    const seatId2 = randomUUID();
    const seatIds = [seatId1, seatId2];
    const query = new GetNotReservedSeatsByIdsQuery(seatIds);

    const eventId = randomUUID();
    const mockSeats = [
      {
        id: seatId1,
        eventId,
        status: 'AVAILABLE' as const,
        price: 50,
        reservedByBookingId: null,
      },
      {
        id: seatId2,
        eventId,
        status: 'AVAILABLE' as const,
        price: 100,
        reservedByBookingId: null,
      },
    ];

    const findManySpy = jest.spyOn(prismaService.seat, 'findMany');
    findManySpy.mockResolvedValue(mockSeats);

    const result = await handler.execute(query);

    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
      },
    });
    expect(findManySpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      new SeatReadModel(seatId1, 50),
      new SeatReadModel(seatId2, 100),
    ]);
  });

  it('should throw an error when at least one seat is reserved', async () => {
    const seatId1 = randomUUID();
    const seatId2 = randomUUID();
    const seatIds = [seatId1, seatId2];
    const query = new GetNotReservedSeatsByIdsQuery(seatIds);

    const eventId = randomUUID();
    const mockSeats = [
      {
        id: seatId1,
        eventId,
        status: 'AVAILABLE' as const,
        price: 50,
        reservedByBookingId: null,
      },
      {
        id: seatId2,
        eventId,
        status: 'RESERVED' as const,
        price: 100,
        reservedByBookingId: randomUUID(),
      },
    ];

    const findManySpy = jest.spyOn(prismaService.seat, 'findMany');
    findManySpy.mockResolvedValue(mockSeats);

    await expect(handler.execute(query)).rejects.toThrow('Seat is reserved');
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
      },
    });
  });

  it('should return an empty array if no seats are found', async () => {
    const seatIds = [randomUUID()];
    const query = new GetNotReservedSeatsByIdsQuery(seatIds);

    const findManySpy = jest.spyOn(prismaService.seat, 'findMany');
    findManySpy.mockResolvedValue([]);

    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
      },
    });
  });

  it('should propagate database errors', async () => {
    const seatIds = [randomUUID()];
    const query = new GetNotReservedSeatsByIdsQuery(seatIds);
    const dbError = new Error('Database error');

    const findManySpy = jest.spyOn(prismaService.seat, 'findMany');
    findManySpy.mockRejectedValue(dbError);

    await expect(handler.execute(query)).rejects.toThrow(dbError);
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
      },
    });
  });
});
