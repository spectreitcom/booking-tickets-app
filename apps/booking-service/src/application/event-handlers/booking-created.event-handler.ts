import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BookingCreatedEvent } from '../../domain/events/booking-created.event';

@EventsHandler(BookingCreatedEvent)
export class BookingCreatedEventHandler implements IEventHandler<BookingCreatedEvent> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: BookingCreatedEvent) {
    const { eventId, seats, bookingId } = event;

    const totalAmount = seats.reduce((acc, seat) => acc + seat.priceAmount, 0);

    await this.prismaService.bookingDetailsView.create({
      data: {
        eventId,
        status: 'PENDING',
        seatIds: seats.map((seat) => seat.seatId),
        totalAmount,
        bookingId,
      },
    });
  }
}
