import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  description: string;
}
