import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly name: string;
}
