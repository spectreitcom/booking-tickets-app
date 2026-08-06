import { CreateEventCommandHandler } from '../create-event.command-handler';
import type { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateEventCommand } from '../../commands/create-event.command';
import { randomUUID } from 'node:crypto';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('CreateEventCommandHandler', () => {
  let handler: CreateEventCommandHandler;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = {
      event: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    handler = new CreateEventCommandHandler(prismaService);
  });

  it('should create a new event', async () => {
    const name = 'Test Event';
    const eventId: string = randomUUID();
    const command = new CreateEventCommand(name);
    const create = jest.spyOn(prismaService.event, 'create');

    create.mockResolvedValue({ id: eventId, name });

    const result = await handler.execute(command);

    expect(create).toHaveBeenCalledWith({ data: { name } });
    expect(result).toEqual(eventId);
  });
});
