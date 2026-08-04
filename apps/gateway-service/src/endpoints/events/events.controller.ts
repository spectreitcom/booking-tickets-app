import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { AddSeatToEventDto } from './dto/add-seat-to-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiCreatedResponse({
    description: 'Event created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    const id = await this.eventsService.createEvent(dto);
    return { id };
  }

  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiOkResponse({
    description: 'Event found successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
      },
    },
  })
  @Get(':eventId')
  async getEvent(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
    return await this.eventsService.getEvent(eventId);
  }

  @ApiOperation({ summary: 'Add a seat to an event' })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiCreatedResponse({
    description: 'Seat added successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  @Post(':eventId/seats')
  async addSeatToEvent(
    @Body() dto: AddSeatToEventDto,
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
  ) {
    const id = await this.eventsService.addSeatToEvent(eventId, dto);
    return { id };
  }
}
