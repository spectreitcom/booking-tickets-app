import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the event to book',
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  readonly eventId: string;

  @ApiProperty({
    isArray: true,
    description: 'The IDs of the seats to book',
    type: 'string',
    format: 'uuid',
  })
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  readonly seatIds: string[];
}
