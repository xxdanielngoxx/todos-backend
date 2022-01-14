import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoRequestDto): Promise<Todo> {
    return this.todoModel.create(createTodoDto);
  }

  findAll() {
    return `This action returns all todos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
