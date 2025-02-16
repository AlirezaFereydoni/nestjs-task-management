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

  async getTasks(search?: string, status?: TaskStatus): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    return await query.getMany();
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
