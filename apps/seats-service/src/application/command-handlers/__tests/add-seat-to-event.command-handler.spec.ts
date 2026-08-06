import { AddSeatToEventCommandHandler } from '../add-seat-to-event.command-handler';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { AddSeatToEventCommand } from '../../commands/add-seat-to-event.command';
import { randomUUID } from 'node:crypto';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('AddSeatToEventCommandHandler', () => {
  let handler: AddSeatToEventCommandHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      event: {
        findUnique: jest.fn(),
      },
      seat: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new AddSeatToEventCommandHandler(prismaService);
  });

  it('should add a new seat to an event', async () => {
    const eventId = randomUUID();
    const seatId = randomUUID();
    const price = 100;
    const command = new AddSeatToEventCommand(eventId, price);
    const findUnique = jest.spyOn(prismaService.event, 'findUnique');
    const create = jest.spyOn(prismaService.seat, 'create');

    findUnique.mockResolvedValue({ id: eventId, name: 'event name' });
    create.mockResolvedValue({
      id: seatId,
      eventId,
      price,
      reservedByBookingId: null,
      status: 'AVAILABLE',
    });

    const result = await handler.execute(command);

    expect(result).toBe(seatId);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: eventId },
    });
    expect(create).toHaveBeenCalledWith({
      data: { eventId, price },
    });
  });

  it('should throw when the event does not exist', async () => {
    const eventId = randomUUID();
    const command = new AddSeatToEventCommand(eventId, 100);
    const findUnique = jest.spyOn(prismaService.event, 'findUnique');
    const create = jest.spyOn(prismaService.seat, 'create');

    findUnique.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow('Event not found');
    expect(create).not.toHaveBeenCalled();
  });
});
