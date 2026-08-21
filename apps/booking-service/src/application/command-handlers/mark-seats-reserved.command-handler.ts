import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { MarkSeatsReservedCommand } from '../commands/mark-seats-reserved.command';
import { BookingRepository } from '../ports/booking.repository';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BookingProcess } from '../ports/booking-process';
import { randomUUID } from 'node:crypto';
import { BookingId } from '../../domain/value-objects/booking-id';

@CommandHandler(MarkSeatsReservedCommand)
export class MarkSeatsReservedCommandHandler implements ICommandHandler<
  MarkSeatsReservedCommand,
  string
> {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly prismaService: PrismaService,
    private readonly eventPublisher: EventPublisher,
    private readonly bookingProcess: BookingProcess,
  ) {}

  async execute(command: MarkSeatsReservedCommand): Promise<string> {
    return await this.prismaService.$transaction(async (tx) => {
      const { bookingId } = command;

      const booking = await this.bookingRepository.findById(
        BookingId.fromString(bookingId),
        tx,
      );

      if (!booking) throw new Error('Booking not found');

      this.eventPublisher.mergeObjectContext(booking);
      booking.markSeatsReserved();

      const sagaId = await this.bookingProcess.chargingPayment(
        { bookingId },
        tx,
      );

      await this.bookingRepository.save(booking, tx, {
        sagaId,
        causationId: randomUUID(),
        correlationId: randomUUID(),
      });

      booking.commit();
      return booking.getId().value;
    });
  }
}
