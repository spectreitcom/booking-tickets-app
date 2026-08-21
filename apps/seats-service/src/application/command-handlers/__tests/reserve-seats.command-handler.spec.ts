import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReserveSeatsCommand } from '../../commands/reserve-seats.command';
import { ReserveSeatsCommandHandler } from '../reserve-seats.command-handler';
import type { OutboxRepository } from '../../ports/outbox.repository';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ReserveSeatsCommandHandler', () => {
  let handler: ReserveSeatsCommandHandler;
  let prismaService: jest.Mocked<PrismaService>;
  let outboxRepository: jest.Mocked<OutboxRepository>;

  beforeEach(() => {
    prismaService = {
      $transaction: jest.fn((cb: (tx: PrismaService) => Promise<unknown>) =>
        cb(prismaService),
      ),
      seat: {
        updateManyAndReturn: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    outboxRepository = {
      enqueue: jest.fn().mockResolvedValue(undefined),
    };

    handler = new ReserveSeatsCommandHandler(prismaService, outboxRepository);
  });

  it('should reserve the requested seats and return their IDs', async () => {
    const seatIds = [randomUUID(), randomUUID()];
    const bookingId = randomUUID();
    const command = new ReserveSeatsCommand(seatIds, bookingId);
    const updateMany = jest.spyOn(prismaService.seat, 'updateManyAndReturn');
    const enqueue = jest.spyOn(outboxRepository, 'enqueue');

    updateMany.mockResolvedValue(
      seatIds.map((id) => ({
        id,
        status: 'RESERVED',
        price: 100,
        eventId: randomUUID(),
        reservedByBookingId: bookingId,
      })),
    );

    const result = await handler.execute(command);

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: seatIds,
        },
        status: 'AVAILABLE',
      },
      data: {
        status: 'RESERVED',
        reservedByBookingId: bookingId,
      },
    });
    expect(enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        messageType: 'booking.mark-seats-reserved.v1',
        routingKey: 'booking.mark-seats-reserved.v1',
        payload: {
          bookingId,
        },
        metadata: {
          correlationId: expect.any(String) as string,
          causationId: expect.any(String) as string,
        },
      }),
      prismaService,
    );
    expect(result).toEqual(seatIds);
  });

  it('should pass an empty seat ID list to the bulk update', async () => {
    const seatIds: string[] = [];
    const bookingId = randomUUID();
    const command = new ReserveSeatsCommand(seatIds, bookingId);
    const updateMany = jest.spyOn(prismaService.seat, 'updateManyAndReturn');
    const enqueue = jest.spyOn(outboxRepository, 'enqueue');

    updateMany.mockResolvedValue([]);

    const result = await handler.execute(command);

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { in: [] }, status: 'AVAILABLE' },
      data: { status: 'RESERVED', reservedByBookingId: bookingId },
    });
    expect(enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        messageType: 'booking.mark-seats-reserved.v1',
        routingKey: 'booking.mark-seats-reserved.v1',
        payload: {
          bookingId,
        },
      }),
      prismaService,
    );
    expect(result).toEqual([]);
  });

  it('should propagate errors from the database', async () => {
    const seatIds = [randomUUID()];
    const bookingId = randomUUID();
    const command = new ReserveSeatsCommand(seatIds, bookingId);
    const databaseError = new Error('Database unavailable');
    const updateMany = jest.spyOn(prismaService.seat, 'updateManyAndReturn');

    updateMany.mockRejectedValue(databaseError);

    await expect(handler.execute(command)).rejects.toBe(databaseError);
  });
});
