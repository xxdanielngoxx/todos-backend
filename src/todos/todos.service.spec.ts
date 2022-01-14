import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
};

describe('TodosService', () => {
  let service: TodosService;
  let model: MockModel<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getModelToken(Todo.name),
          useValue: createMockModel<Todo>(),
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    model = module.get<MockModel<Todo>>(getModelToken(Todo.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should model be defined', () => {
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should be saved successfulled', async () => {
      const createTodoRequestDto: CreateTodoRequestDto = {
        name: 'Todo 1',
        status: 'pending',
        description: 'Todo 1 description',
      };

      const expectedTodo = {
        _id: 'uuid-asdaasdadas',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createTodoRequestDto,
      };

      model.create.mockResolvedValueOnce(expectedTodo);
      const todo = await model.create(CreateTodoRequestDto);
      expect(todo).toEqual(expectedTodo);
    });
  });

  describe('findOne', () => {
    describe('when todo with ID exists', () => {
      it('should return todo', async () => {
        const id = 'id_todo_1';
        const expectedTodo: Partial<Todo> = {
          _id: id,
          name: 'Todo 1',
          status: 'pending',
          description: 'Description of todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest.spyOn(model, 'findOne').mockReturnValueOnce(
          createMock<Query<Todo, Todo>>({
            exec: jest.fn().mockResolvedValue(expectedTodo),
          }),
        );

        const todo = await service.findOne(id);
        expect(todo).toEqual(expectedTodo);
      });
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const id = 'id_todo_1';
        jest.spyOn(model, 'findOne').mockReturnValueOnce(
          createMock<Query<Todo, Todo>>({
            exec: jest.fn().mockResolvedValue(undefined),
          }),
        );

        try {
          await service.findOne(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Todo #${id} not found`);
        }
      });
    });
  });
});
