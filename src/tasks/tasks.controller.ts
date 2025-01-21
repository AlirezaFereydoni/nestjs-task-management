import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/task.dto';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(CreateTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id): void {
    this.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateStatusById(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): string | Task {
    const response = this.tasksService.updateStatusById(id, status);

    return response;
  }
}
