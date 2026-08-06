import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReserveSeatsCommand } from '../commands/reserve-seats.command';
import { PrismaService } from '../../shared/prisma/prisma.service';

@CommandHandler(ReserveSeatsCommand)
export class ReserveSeatsCommandHandler implements ICommandHandler<
  ReserveSeatsCommand,
  string[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: ReserveSeatsCommand): Promise<string[]> {
    const { seatIds } = command;

    const result = await this.prismaService.seat.updateManyAndReturn({
      where: {
        id: {
          in: seatIds,
        },
        status: 'AVAILABLE',
      },
      data: {
        status: 'RESERVED',
      },
    });

    return result.map((seat) => seat.id);
  }
}
