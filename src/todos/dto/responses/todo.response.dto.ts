import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { Todo } from '../../entities/todo.entity';

@Exclude()
export class TodoResponseDto {
  @Expose()
  @ApiProperty()
  id: any;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;

  constructor(partial: Partial<Todo> = {}) {
    const id =
      partial._id instanceof Types.ObjectId
        ? partial._id.toString()
        : undefined;
    Object.assign(this, partial, id && { id });
  }

  public static fromEntity(partial: Partial<Todo>): TodoResponseDto {
    return new TodoResponseDto(partial);
  }
}
