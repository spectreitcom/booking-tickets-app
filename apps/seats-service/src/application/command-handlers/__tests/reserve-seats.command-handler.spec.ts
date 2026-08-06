import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReserveSeatsCommand } from '../../commands/reserve-seats.command';
import { ReserveSeatsCommandHandler } from '../reserve-seats.command-handler';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ReserveSeatsCommandHandler', () => {
  let handler: ReserveSeatsCommandHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      seat: {
        updateMany: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new ReserveSeatsCommandHandler(prismaService);
  });

  it('should reserve the requested seats and return their IDs', async () => {
    const seatIds = [randomUUID(), randomUUID()];
    const command = new ReserveSeatsCommand(seatIds);
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
        status: 'RESERVED',
      },
    });
    expect(result).toEqual(seatIds);
  });

  it('should pass an empty seat ID list to the bulk update', async () => {
    const seatIds: string[] = [];
    const command = new ReserveSeatsCommand(seatIds);
    const updateMany = jest.spyOn(prismaService.seat, 'updateMany');

    updateMany.mockResolvedValue({ count: 0 });

    const result = await handler.execute(command);

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { in: [] } },
      data: { status: 'RESERVED' },
    });
    expect(result).toEqual([]);
  });

  it('should propagate errors from the database', async () => {
    const seatIds = [randomUUID()];
    const command = new ReserveSeatsCommand(seatIds);
    const databaseError = new Error('Database unavailable');
    const updateMany = jest.spyOn(prismaService.seat, 'updateMany');

    updateMany.mockRejectedValue(databaseError);

    await expect(handler.execute(command)).rejects.toBe(databaseError);
  });
});
