import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEventCommand } from '../application/commands/create-event.command';
import { AddSeatToEventDto } from './dto/add-seat-to-event.dto';
import { AddSeatToEventCommand } from '../application/commands/add-seat-to-event.command';
import { GetEventDto } from './dto/get-event.dto';
import { GetEventQuery } from '../application/queries/get-event.query';
import { EventReadModel } from '../application/query-handlers/read-models/event.read-model';
import { GetNotReservedSeatsByIdsQuery } from '../application/queries/get-not-reserved-seats-by-ids.query';
import { SeatReadModel } from '../application/query-handlers/read-models/seat.read-model';
import { GetNotReservedSeatsByIdsDto } from './dto/get-not-reserved-seats-by-ids.dto';

@Controller()
export class SeatsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('seats.create-event')
  async createEvent(@Payload() payload: CreateEventDto) {
    return await this.commandBus.execute<CreateEventCommand, string>(
      new CreateEventCommand(payload.name),
    );
  }

  @MessagePattern('seats.add-seat')
  async addSeatToEvent(@Payload() payload: AddSeatToEventDto) {
    return await this.commandBus.execute<AddSeatToEventCommand, string>(
      new AddSeatToEventCommand(payload.eventId, payload.price),
    );
  }

  @MessagePattern('seats.get-event')
  async getEvent(@Payload() payload: GetEventDto) {
    return await this.queryBus.execute<GetEventQuery, EventReadModel>(
      new GetEventQuery(payload.eventId),
    );
  }

  @MessagePattern('seats.get-not-reserved-seats-by-ids')
  async getNotReservedSeatsByIds(
    @Payload() payload: GetNotReservedSeatsByIdsDto,
  ) {
    return await this.queryBus.execute<
      GetNotReservedSeatsByIdsQuery,
      SeatReadModel[]
    >(new GetNotReservedSeatsByIdsQuery(payload.seatIds));
  }
}
