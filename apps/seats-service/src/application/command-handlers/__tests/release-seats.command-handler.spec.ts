import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReleaseSeatsCommand } from '../../commands/release-seats.command';
import { ReleaseSeatsCommandHandler } from '../release-seats.command-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ReleaseSeatsCommandHandler', () => {
  let handler: ReleaseSeatsCommandHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      seat: {
        updateManyAndReturn: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new ReleaseSeatsCommandHandler(prismaService);
  });

  it('should release the requested seats and return their IDs', async () => {
    const seatIds = [randomUUID(), randomUUID()];
    const command = new ReleaseSeatsCommand(seatIds);
    const updateManyAndReturn = jest.spyOn(
      prismaService.seat,
      'updateManyAndReturn',
    );

    updateManyAndReturn.mockResolvedValue(
      seatIds.map((id) => ({
        id,
        status: 'AVAILABLE',
        price: 100,
        eventId: randomUUID(),
        reservedByBookingId: null,
      })),
    );

    const result = await handler.execute(command);

    expect(updateManyAndReturn).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
        status: 'RESERVED',
      },
      data: {
        status: 'AVAILABLE',
      },
    });
    expect(result).toEqual(seatIds);
  });

  it('should pass an empty seat ID list to the bulk update', async () => {
    const seatIds: string[] = [];
    const command = new ReleaseSeatsCommand(seatIds);
    const updateManyAndReturn = jest.spyOn(
      prismaService.seat,
      'updateManyAndReturn',
    );

    updateManyAndReturn.mockResolvedValue([]);

    const result = await handler.execute(command);

    expect(updateManyAndReturn).toHaveBeenCalledWith({
      where: { id: { in: [] }, status: 'RESERVED' },
      data: { status: 'AVAILABLE' },
    });
    expect(result).toEqual([]);
  });

  it('should propagate errors from the database', async () => {
    const seatIds = [randomUUID()];
    const command = new ReleaseSeatsCommand(seatIds);
    const databaseError = new Error('Database unavailable');
    const updateMany = jest.spyOn(prismaService.seat, 'updateManyAndReturn');

    updateMany.mockRejectedValue(databaseError);

    await expect(handler.execute(command)).rejects.toBe(databaseError);
  });
});
