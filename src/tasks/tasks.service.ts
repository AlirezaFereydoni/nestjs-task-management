import { CreateTaskDto } from './dto/createTask.dto';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private tasksRepository: TaskRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  async getTasks(search?: string, status?: TaskStatus): Promise<Task[]> {
    const filters: Record<string, unknown> = {};

    if (search) {
      filters.search = Equal(status);
    }

    if (status) {
      filters.status = Like(`%${search}%`);
    }

    return await this.tasksRepository.find({
      where: filters,
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const found = this.tasksRepository.findOne({ where: { id } });
    if (!found) throw new Error('Not Found');
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };

    const newTask = await this.tasksRepository.create(task);
    return newTask;
  }

  async deleteTaskById(id: string) {
    await this.tasksRepository.delete(id);
  }

  async updateStatusById(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    if (!task) return 'Not Found';
    return await this.tasksRepository.update(id, { status });
  }
}
