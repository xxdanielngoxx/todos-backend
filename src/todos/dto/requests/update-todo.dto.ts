import { PartialType } from '@nestjs/swagger';
import { CreateTodoRequestDto } from './create-todo.request.dto';

export class UpdateTodoDto extends PartialType(CreateTodoRequestDto) {}
