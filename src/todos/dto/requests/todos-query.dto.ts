import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, Max, Min } from 'class-validator';

export class TodosQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Format: yyyy-mm-dd',
  })
  createdAt?: Date;

  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false })
  pageNumber?: number;

  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false })
  pageSize?: number;
}
