import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { TodosQueryDto } from './dto/requests/todos-query.dto';
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

  findAll(todosQueryDto: TodosQueryDto): Promise<Todo[]> {
    const pageNumber = todosQueryDto.pageNumber || 1;
    const limit = todosQueryDto.pageSize || 10;
    const offset = (pageNumber - 1) * limit;

    const { name, createdAt } = todosQueryDto;

    const nameQuery = name ? { name: { $regex: `.*${name}.*` } } : {};
    const createdAtQuery = createdAt ? { createdAt: { $gte: createdAt } } : {};

    const options: QueryOptions = { skip: offset, limit };

    return this.todoModel
      .find({ ...nameQuery, ...createdAtQuery }, {}, options)
      .exec();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findOne({ _id: id }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const existingTodo = await this.todoModel
      .findOneAndUpdate({ _id: id }, { $set: updateTodoDto }, { new: true })
      .exec();

    if (!existingTodo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }

    return existingTodo;
  }

  async remove(id: string): Promise<Todo> {
    const existingTodo = await this.todoModel.findOne({ _id: id }).exec();

    if (!existingTodo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }

    return existingTodo.remove();
  }
}
