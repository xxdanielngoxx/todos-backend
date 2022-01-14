import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoResponseDto } from './dto/responses/create-todo.response.dto';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  private readonly logger = new Logger(TodosController.name);

  @Post()
  @ApiResponse({
    type: CreateTodoResponseDto,
    description: 'The todo has been successfully created.',
  })
  async create(
    @Body() createTodoDto: CreateTodoRequestDto,
  ): Promise<CreateTodoResponseDto> {
    const todo = await this.todosService.create(createTodoDto);
    return CreateTodoResponseDto.fromEntity(todo.toJSON());
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
