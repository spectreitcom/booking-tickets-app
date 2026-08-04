import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddSeatToEventCommand } from '../commands/add-seat-to-event.command';
import { PrismaService } from '../../shared/prisma/prisma.service';

@CommandHandler(AddSeatToEventCommand)
export class AddSeatToEventCommandHandler implements ICommandHandler<
  AddSeatToEventCommand,
  string
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: AddSeatToEventCommand): Promise<string> {
    const { eventId, price } = command;

    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const seat = await this.prismaService.seat.create({
      data: {
        eventId,
        price,
      },
    });

    return seat.id;
  }
}
