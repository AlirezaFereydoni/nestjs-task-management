import { CreateTaskDto } from './dto/createTask.dto';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks(search?: string, status?: TaskStatus): Task[] {
    let filteredTasks = this.tasks;

    if (search) {
      filteredTasks = this.tasks.filter((task) => task.title.includes(search));
    }

    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((item) => item.id === id);
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((item) => item.id !== id);
  }

  updateStatusById(id: string, status: TaskStatus): string | Task {
    const task = this.getTaskById(id);
    if (!task) return 'Not Found';
    task.status = status;

    return task;
  }
}
