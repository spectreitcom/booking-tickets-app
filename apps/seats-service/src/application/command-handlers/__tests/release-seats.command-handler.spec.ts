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
        updateMany: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new ReleaseSeatsCommandHandler(prismaService);
  });

  it('should release the requested seats and return their IDs', async () => {
    const seatIds = [randomUUID(), randomUUID()];
    const command = new ReleaseSeatsCommand(seatIds);
    const updateMany = jest.spyOn(prismaService.seat, 'updateMany');

    updateMany.mockResolvedValue({ count: seatIds.length });

    const result = await handler.execute(command);

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
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
    const updateMany = jest.spyOn(prismaService.seat, 'updateMany');

    updateMany.mockResolvedValue({ count: 0 });

    const result = await handler.execute(command);

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { in: [] } },
      data: { status: 'AVAILABLE' },
    });
    expect(result).toEqual([]);
  });

  it('should propagate errors from the database', async () => {
    const seatIds = [randomUUID()];
    const command = new ReleaseSeatsCommand(seatIds);
    const databaseError = new Error('Database unavailable');
    const updateMany = jest.spyOn(prismaService.seat, 'updateMany');

    updateMany.mockRejectedValue(databaseError);

    await expect(handler.execute(command)).rejects.toBe(databaseError);
  });
});
