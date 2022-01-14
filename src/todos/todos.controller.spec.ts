import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FlattenMaps, LeanDocument } from 'mongoose';
import { TodoResponseDto } from './dto/responses/todo.response.dto';
import { Todo } from './entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined TodoService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoRequestDto = {
        name: 'Todo 1',
        status: 'pending',
        description: 'Description for todo 1',
      };

      const expectedJson = {
        _id: 'id_todo_1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createTodoRequestDto,
      } as FlattenMaps<LeanDocument<Todo>>;

      jest.spyOn(service, 'create').mockResolvedValueOnce(
        createMock<Todo>({
          toJSON: jest.fn().mockReturnValueOnce(expectedJson),
        }),
      );

      const todo = await controller.create(createTodoRequestDto);
      expect(TodoResponseDto.fromEntity(todo)).toEqual(
        TodoResponseDto.fromEntity(expectedJson),
      );
    });
  });

  describe('findOne', () => {
    describe('when todo with ID exists', () => {
      it('should return the todo object', async () => {
        const id = 'id_todo_1';
        const expectedTodo = {
          _id: id,
          name: 'Todo 1',
          status: 'pending',
          description: 'Description of todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as FlattenMaps<LeanDocument<Todo>>;

        jest.spyOn(service, 'findOne').mockResolvedValue(
          createMock<Todo>({
            toJSON: jest.fn().mockReturnValueOnce(expectedTodo),
          }),
        );

        const todo = await controller.findOne(id);
        expect(TodoResponseDto.fromEntity(todo)).toEqual(
          TodoResponseDto.fromEntity(expectedTodo),
        );
      });
    });

    describe('otherwise', () => {
      it('should throw "NotFoundErrorException"', async () => {
        const id = 'id_todo_1';

        jest.spyOn(service, 'findOne').mockResolvedValue(
          createMock<Todo>({
            toJSON: jest.fn().mockReturnValueOnce(undefined),
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
