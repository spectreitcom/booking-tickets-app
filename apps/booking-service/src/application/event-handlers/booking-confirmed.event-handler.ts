import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingConfirmedEvent } from '../../domain/events/booking-confirmed.event';
import { PrismaService } from '../../shared/prisma/prisma.service';

@EventsHandler(BookingConfirmedEvent)
export class BookingConfirmedEventHandler implements IEventHandler<BookingConfirmedEvent> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: BookingConfirmedEvent) {
    const { bookingId, paymentId } = event;

    await this.prismaService.bookingDetailsView.update({
      where: {
        bookingId,
      },
      data: {
        status: 'CONFIRMED',
        paymentId,
      },
    });
  }
}
