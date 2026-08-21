import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingCommand } from '../application/commands/create-booking.command';
import { MarkSeatsReservedCommand } from '../application/commands/mark-seats-reserved.command';

@Controller()
export class BookingController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('booking.create')
  async createBooking(@Payload() payload: CreateBookingDto) {
    const command = new CreateBookingCommand(
      payload.eventId,
      payload.seats,
      payload.correlationId,
      payload.causationId,
    );

    return await this.commandBus.execute<CreateBookingCommand, string>(command);
  }

  @EventPattern('booking.mark-seats-reserved.v1')
  async handleMarkSeatsReserved(data: { bookingId: string }) {
    console.log('BookingController.handleMarkSeatsReserved', data); // todo;
    await this.commandBus.execute(new MarkSeatsReservedCommand(data.bookingId));
  }
}
