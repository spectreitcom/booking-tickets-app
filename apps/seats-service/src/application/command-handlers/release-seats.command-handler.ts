import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReleaseSeatsCommand } from '../commands/release-seats.command';
import { PrismaService } from '../../shared/prisma/prisma.service';

@CommandHandler(ReleaseSeatsCommand)
export class ReleaseSeatsCommandHandler implements ICommandHandler<
  ReleaseSeatsCommand,
  string[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: ReleaseSeatsCommand): Promise<string[]> {
    const { seatIds } = command;

    await this.prismaService.seat.updateMany({
      where: {
        id: {
          in: seatIds,
        },
      },
      data: {
        status: 'AVAILABLE',
      },
    });

    return seatIds;
  }
}
