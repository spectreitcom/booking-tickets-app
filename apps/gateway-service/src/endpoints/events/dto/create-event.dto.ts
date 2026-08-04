import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly name: string;
}
