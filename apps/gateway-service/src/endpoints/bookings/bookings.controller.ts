import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({
    summary: 'Create a booking',
  })
  @ApiCreatedResponse({
    description: 'Booking created successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    const id = await this.bookingsService.createBooking(createBookingDto);
    return { id };
  }
}
