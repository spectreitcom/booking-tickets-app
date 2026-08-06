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

    const result = await this.prismaService.seat.updateManyAndReturn({
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

    return result.map((seat) => seat.id);
  }
}
