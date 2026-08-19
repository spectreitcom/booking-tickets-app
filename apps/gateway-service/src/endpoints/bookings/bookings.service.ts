import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKING_SERVICE, SEATS_SERVICE } from '../../constants';
import { CreateBookingDto } from './dto/create-booking.dto';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'node:crypto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BOOKING_SERVICE)
    private readonly bookingService: ClientProxy,
    @Inject(SEATS_SERVICE)
    private readonly seatsService: ClientProxy,
  ) {}

  async createBooking(payload: CreateBookingDto) {
    const seats = await firstValueFrom(
      this.seatsService.send<
        { seatId: string; priceAmount: number }[],
        { seatIds: string[] }
      >('seats.get-not-reserved-seats-by-ids', {
        seatIds: payload.seatIds,
      }),
    );

    return await firstValueFrom(
      this.bookingService.send<
        string,
        {
          eventId: string;
          seats: {
            seatId: string;
            priceAmount: number;
          }[];
          correlationId: string;
          causationId: string;
        }
      >('booking.create', {
        causationId: randomUUID(),
        correlationId: randomUUID(),
        eventId: payload.eventId,
        seats,
      }),
    );
  }
}
