import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { ReserveSeatsCommand } from '../commands/reserve-seats.command';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OutboxRepository } from '../ports/outbox.repository';

@CommandHandler(ReserveSeatsCommand)
export class ReserveSeatsCommandHandler implements ICommandHandler<
  ReserveSeatsCommand,
  string[]
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(command: ReserveSeatsCommand): Promise<string[]> {
    return await this.prismaService.$transaction(async (prisma) => {
      const { seatIds, bookingId } = command;

      const result = await prisma.seat.updateManyAndReturn({
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

      await this.outboxRepository.enqueue(
        {
          messageType: 'booking.mark-seats-reserved.v1',
          routingKey: 'booking.mark-seats-reserved.v1',
          payload: {
            bookingId,
          },
          metadata: {
            correlationId: randomUUID(),
            causationId: randomUUID(),
          },
        },
        prisma,
      );

      return result.map((seat) => seat.id);
    });
  }
}
