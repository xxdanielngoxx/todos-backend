import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodoResponseDto } from './dto/responses/todo.response.dto';
import { TodosQueryDto } from './dto/requests/todos-query.dto';
import { Todo } from './entities/todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  private readonly logger = new Logger(TodosController.name);

  @Post()
  @ApiResponse({
    type: TodoResponseDto,
    description: 'The todo has been successfully created.',
  })
  async create(
    @Body() createTodoDto: CreateTodoRequestDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.create(createTodoDto);
    return TodoResponseDto.fromEntity(todo.toJSON());
  }

  @Get()
  async findAll(
    @Query() todosQueryDto: TodosQueryDto,
  ): Promise<TodoResponseDto[]> {
    const todos: Todo[] = await this.todosService.findAll(todosQueryDto);
    return todos.map((todo) => TodoResponseDto.fromEntity(todo.toJSON()));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TodoResponseDto> {
    const todo = await this.todosService.findOne(id);
    return TodoResponseDto.fromEntity(todo.toJSON());
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.update(id, updateTodoDto);
    return TodoResponseDto.fromEntity(todo.toJSON());
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TodoResponseDto> {
    const todo = await this.todosService.remove(id);
    return TodoResponseDto.fromEntity(todo.toJSON());
  }
}
