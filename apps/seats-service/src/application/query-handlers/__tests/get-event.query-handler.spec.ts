import { GetEventQueryHandler } from '../get-event.query-handler';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { GetEventQuery } from '../../queries/get-event.query';
import { randomUUID } from 'node:crypto';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('GetEventQueryHandler', () => {
  let handler: GetEventQueryHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      event: {
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new GetEventQueryHandler(prismaService);
  });

  it('should return an event read model', async () => {
    const eventId = randomUUID();
    const eventName = 'Test Event';
    const query = new GetEventQuery(eventId);

    const findUniqueSpy = jest.spyOn(prismaService.event, 'findUnique');

    findUniqueSpy.mockResolvedValue({ id: eventId, name: eventName });

    const result = await handler.execute(query);

    expect(result).toEqual({ id: eventId, name: eventName });
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: eventId } });
    expect(findUniqueSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when event is not found', async () => {
    const eventId = randomUUID();
    const query = new GetEventQuery(eventId);
    const findUniqueSpy = jest.spyOn(prismaService.event, 'findUnique');

    findUniqueSpy.mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow('Event not found');
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: eventId } });
    expect(findUniqueSpy).toHaveBeenCalledTimes(1);
  });
});
