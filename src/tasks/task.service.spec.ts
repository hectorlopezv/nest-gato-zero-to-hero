import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRespository = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findOneBy: jest.fn(),
}); // mockTaskRespository
const mockUser = {
  username: 'Test user',
  id: 'some',
  password: 'somepass',
  tasks: [],
};
describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    //inititialize a nestjs with tasskRepository, taskService
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRespository },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('call Taskrepository.getTask and return the resuslt', async () => {
      expect(taskRepository.findAll).not.toHaveBeenCalled();
      taskRepository.findAll.mockResolvedValue('someValue');
      const resuslt = taskService.getTasks(null, mockUser);
      expect(taskRepository.findAll).toHaveBeenCalled();

      await expect(resuslt).resolves.toEqual('someValue');
    });
  });
  describe('getTasksById', () => {
    it('call Taskrepository.findOne and return the resuslt', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };
      taskRepository.findById.mockResolvedValue(mockTask);
      const resuslt = await taskService.getTaskById('someId', mockUser);
      expect(resuslt).toEqual(mockTask);
    });
    it('call Taskrepository.findOne and handles an error', async () => {
      taskRepository.findOneBy.mockResolvedValue(null);
      taskRepository.findById.mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
