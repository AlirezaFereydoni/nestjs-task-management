import { CreateTaskDto } from './dto/createTask.dto';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomUUID } from 'crypto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private tasksRepository: TaskRepository,
  ) {}
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
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

  async getTaskById(id: string): Promise<Task> {
    const found = this.tasksRepository.findOne({ where: { id } });
    if (!found) throw new Error('Not Found');
    return found;
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
