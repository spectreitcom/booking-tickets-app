import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingSeatsReservedEvent } from '../../domain/events/booking-seats-reserved.event';
import { PrismaService } from '../../shared/prisma/prisma.service';

@EventsHandler(BookingSeatsReservedEvent)
export class BookingSeatsReservedEventHandler implements IEventHandler<BookingSeatsReservedEvent> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: BookingSeatsReservedEvent) {
    const { bookingId } = event;

    await this.prismaService.bookingDetailsView.update({
      where: {
        bookingId,
      },
      data: {
        status: 'SEATS_RESERVED',
      },
    });
  }
}
