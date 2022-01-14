import { Test, TestingModule } from '@nestjs/testing';
import { FlattenMaps, LeanDocument } from 'mongoose';
import { CreateTodoResponseDto } from './dto/responses/create-todo.response.dto';
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
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
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

      const expectedTodo = {
        toJSON: () => expectedJson,
      } as Todo;

      jest.spyOn(service, 'create').mockResolvedValueOnce(expectedTodo);

      const todo = await controller.create(createTodoRequestDto);
      expect(CreateTodoResponseDto.fromEntity(todo)).toEqual(
        CreateTodoResponseDto.fromEntity(expectedJson),
      );
    });
  });
});
