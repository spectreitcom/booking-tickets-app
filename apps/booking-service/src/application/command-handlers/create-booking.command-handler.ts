import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from '../commands/create-booking.command';
import { BookingRepository } from '../ports/booking.repository';
import { Booking } from '../../domain/booking';
import { OutboxRepository } from '../ports/outbox.repository';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import { BookingProcess } from '../ports/booking-process';

@CommandHandler(CreateBookingCommand)
export class CreateBookingCommandHandler implements ICommandHandler<
  CreateBookingCommand,
  string
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly bookingRepository: BookingRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly prismaService: PrismaService,
    private readonly bookingProcess: BookingProcess,
  ) {}

  async execute(command: CreateBookingCommand): Promise<string> {
    return await this.prismaService.$transaction(async (tx) => {
      const { seats, eventId, correlationId, causationId } = command;

      const booking = Booking.create(eventId, seats);
      this.eventPublisher.mergeObjectContext(booking);

      const sagaId = randomUUID();

      await this.bookingRepository.save(booking, tx, {
        correlationId,
        causationId,
        sagaId,
      });

      await this.outboxRepository.enqueue(
        {
          messageType: 'seats.reserve.v1',
          routingKey: 'seats.reserve.v1',
          metadata: {
            correlationId,
            causationId,
            sagaId,
          },
          payload: {
            bookingId: booking.getId().value,
            eventId: booking.getEventId().value,
            seatIds: booking.getSeats().map((seat) => seat.seatId),
          },
        },
        tx,
      );

      await this.bookingProcess.create(
        {
          sagaId,
          bookingId: booking.getId().value,
        },
        tx,
      );

      booking.commit();
      return booking.getId().value;
    });
  }
}
