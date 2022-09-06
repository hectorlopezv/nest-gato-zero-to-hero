import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './task.model';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTasks(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    //find the task with the id
    const found = this.tasks.find((task) => task.id === id);
    //if not found throw an error
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    //return the task
    return found;
  }

  deleteTaskById(id: string): Task {
    const findTask = this.getTaskById(id);
    const newArray = this.tasks.filter((task) => task.id !== id);
    this.tasks = [...newArray];
    return findTask;
  }

  updateTaskById(id: string, updateTaskStatusDto: UpdateTaskStatusDto): void {
    const task = this.getTaskById(id);
    const { status } = updateTaskStatusDto;
    task.status = status;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    //define a temporary array to hold result
    let tasks = this.getAllTasks();

    //do something with status
    if (status) {
      tasks = tasks.filter((tasks) => tasks.status === status);
    }
    //do somethihg with serach
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    //return final result
    return tasks;
  }
}
