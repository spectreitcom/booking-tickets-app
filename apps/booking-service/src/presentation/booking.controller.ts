import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingCommand } from '../application/commands/create-booking.command';

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
}
