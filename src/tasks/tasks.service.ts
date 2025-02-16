import { CreateTaskDto } from './dto/createTask.dto';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Like } from 'typeorm';
import { Task as TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private tasksRepository: TaskRepository,
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

    const newTask = this.tasksRepository.create(task);
    await this.tasksRepository.save(newTask);

    return newTask;
  }

  async deleteTaskById(id: string): Promise<DeleteResult> {
    const result = await this.tasksRepository.delete(id);

    if (!result.affected) throw new Error('Not Found');
    return result;
  }

  async updateStatusById(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    if (!task) return 'Not Found';
    return await this.tasksRepository.update(id, { status });
  }
}
