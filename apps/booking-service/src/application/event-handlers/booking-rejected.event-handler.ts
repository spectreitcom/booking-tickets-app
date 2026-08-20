import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingRejectedEvent } from '../../domain/events/booking-rejected.event';
import { PrismaService } from '../../shared/prisma/prisma.service';

@EventsHandler(BookingRejectedEvent)
export class BookingRejectedEventHandler implements IEventHandler<BookingRejectedEvent> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: BookingRejectedEvent) {
    const { bookingId } = event;

    await this.prismaService.bookingDetailsView.update({
      where: { bookingId },
      data: {
        status: 'REJECTED',
      },
    });
  }
}
