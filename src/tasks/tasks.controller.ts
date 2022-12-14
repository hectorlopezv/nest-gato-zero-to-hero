import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(
    private taskService: TasksService,
    private configService: ConfigService,
  ) {
    console.log('data', configService.get('TEST_VALUE'));
  }
  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser()
    user: User,
  ): Promise<Task[]> {
    //if we have any filters defined, call taskService, getTaskFilters
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    const response = await this.taskService.getTasks(filterDto, user);
    return response;
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser()
    user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task, Data: ${
        createTaskDto.title
      }, ${JSON.stringify(createTaskDto)}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser()
    user: User,
  ): Promise<Task> {
    return await this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  async deleteTaskById(
    @Param('id') id: string,
    @GetUser()
    user: User,
  ): Promise<void> {
    await this.taskService.deleteTask(id, user);
  }

  @Patch('/:id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser()
    user: User,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(
      id,
      updateTaskStatusDto.status,
      user,
    );
  }
}
