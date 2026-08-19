import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotReservedSeatsByIdsQuery } from '../queries/get-not-reserved-seats-by-ids.query';
import { SeatReadModel } from './read-models/seat.read-model';
import { PrismaService } from '../../shared/prisma/prisma.service';

@QueryHandler(GetNotReservedSeatsByIdsQuery)
export class GetNotReservedSeatsByIdsQueryHandler implements IQueryHandler<
  GetNotReservedSeatsByIdsQuery,
  SeatReadModel[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetNotReservedSeatsByIdsQuery,
  ): Promise<SeatReadModel[]> {
    const { seatIds } = query;

    const seats = await this.prismaService.seat.findMany({
      where: {
        id: {
          in: seatIds,
        },
      },
    });

    for (const seat of seats) {
      if (seat.reservedByBookingId) {
        throw new Error('Seat is reserved');
      }
    }

    return seats.map((seat) => new SeatReadModel(seat.id, seat.price));
  }
}
