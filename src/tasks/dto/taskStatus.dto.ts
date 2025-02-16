import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
