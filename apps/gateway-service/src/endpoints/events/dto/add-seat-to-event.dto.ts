import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSeatToEventDto {
  @ApiProperty({
    description: 'The price of the seat in cents',
    format: 'int32',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  readonly price: number;
}
