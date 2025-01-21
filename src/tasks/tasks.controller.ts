import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
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
  getTask(@Param('id') id): Task {
    return this.tasksService.getTask(id);
  }

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(CreateTaskDto);
  }
}
