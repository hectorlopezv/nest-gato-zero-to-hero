import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
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
    return this.tasks.find((task) => task.id === id);
  }

  deleteTaskById(id: string): Task {
    const findTask = this.getTaskById(id);
    const newArray = this.tasks.filter((task) => task.id !== id);
    this.tasks = [...newArray];
    return findTask;
  }

  updateTaskById(id: string, updateTaskDto: UpdateTaskDto): void {
    const { description, title } = updateTaskDto;
    const findTaskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks[findTaskIndex] = {
      ...this.tasks[findTaskIndex],
      description,
      title,
    };
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
