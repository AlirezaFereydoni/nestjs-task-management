import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskStatusDto } from './dto/taskStatus.dto';
import { SearchTaskDto } from './dto/searchTask.dto';
import { UpdateResult } from 'typeorm';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getTasks(@Query() searchTaskDto: SearchTaskDto): Promise<Task[]> {
    const { search, status } = searchTaskDto;

    if (search || status) {
      return this.tasksService.getTasks(search, status);
    }

    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id): Promise<Task> {
    const task = this.tasksService.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(CreateTaskDto);
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id): Promise<void> {
    console.log({ id }, 'in controller');
    await this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateStatusById(
    @Param('id') id: string,
    @Body() TaskStatusDto: TaskStatusDto,
  ): Promise<'Not Found' | UpdateResult> {
    const { status } = TaskStatusDto;
    const response = this.tasksService.updateStatusById(id, status);

    return response;
  }
}
