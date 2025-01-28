import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  description: string;
}
