import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Todo } from '../../entities/todo.entity';

@Exclude()
export class CreateTodoResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  constructor(partial: Partial<Todo> = {}) {
    Object.assign(this, partial);
  }

  public static fromEntity(partial: Partial<Todo>): CreateTodoResponseDto {
    return new CreateTodoResponseDto(partial);
  }
}
