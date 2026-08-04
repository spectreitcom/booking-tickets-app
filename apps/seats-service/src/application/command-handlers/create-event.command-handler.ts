import { CreateEventCommand } from '../commands/create-event.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../shared/prisma/prisma.service';

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler implements ICommandHandler<
  CreateEventCommand,
  string
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreateEventCommand): Promise<string> {
    const { name } = command;

    const event = await this.prismaService.event.create({
      data: {
        name,
      },
    });

    return event.id;
  }
}
