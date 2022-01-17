import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoRequestDto } from './dto/requests/create-todo.request.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
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
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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
      const expectedTodo = createMock<Todo>({
        toJSON: jest.fn().mockReturnValue({
          _id: 'id_todo_1',
          name: 'Todo 1',
          status: 'pending',
          description: 'Description for todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      jest.spyOn(service, 'create').mockResolvedValueOnce(expectedTodo);

      const todo = await controller.create({} as CreateTodoRequestDto);

      expect(todo).toEqual(TodoResponseDto.fromEntity(expectedTodo.toJSON()));
    });
  });

  describe('findOne', () => {
    it('should return the todo object', async () => {
      const id = 'id_todo_1';
      const expectedTodo = createMock<Todo>({
        toJSON: jest.fn().mockReturnValue({
          _id: id,
          name: 'Todo 1',
          status: 'pending',
          description: 'Description of todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedTodo);

      const todo = await controller.findOne(id);

      expect(todo).toEqual(TodoResponseDto.fromEntity(expectedTodo.toJSON()));
    });
  });

  describe('findAll', () => {
    it('should return todos', async () => {
      const expectedTodos = createMock<Todo[]>([
        {
          toJSON: jest.fn().mockReturnValue({
            _id: '_id_todo_1',
            name: 'Todo 1',
            status: 'pending',
            description: 'Description todo 1',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        },
        {
          toJSON: jest.fn().mockReturnValue({
            _id: '_id_todo_2',
            name: 'Todo 2',
            status: 'pending',
            description: 'Description todo 2',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        },
      ]);

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedTodos);

      const todos = await controller.findAll({} as TodoResponseDto);

      expect(todos).toEqual(
        expectedTodos.map((todo) => TodoResponseDto.fromEntity(todo.toJSON())),
      );
    });
  });

  describe('update', () => {
    it('should update and return updated todo', async () => {
      const id = 'id_todo_1';
      const expectedTodo = createMock<Todo>({
        toJSON: jest.fn().mockReturnValue({
          _id: id,
          name: 'Todo 1',
          status: 'pending',
          description: 'Description todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      jest.spyOn(service, 'update').mockResolvedValueOnce(expectedTodo);

      const todo = await controller.update(id, {} as UpdateTodoDto);

      expect(todo).toEqual(TodoResponseDto.fromEntity(expectedTodo.toJSON()));
    });
  });

  describe('delete', () => {
    it('should delete and return deleted todo', async () => {
      const id = 'id_todo_1';

      const expectedTodo = createMock<Todo>({
        toJSON: jest.fn().mockReturnValue({
          _id: id,
          name: 'Todo 1',
          status: 'pending',
          description: 'Description todo 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      jest.spyOn(service, 'remove').mockResolvedValue(expectedTodo);

      const todo = await controller.remove(id);

      expect(todo).toEqual(TodoResponseDto.fromEntity(expectedTodo.toJSON()));
    });
  });
});
