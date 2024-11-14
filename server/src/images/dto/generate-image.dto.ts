import { Size } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class GenerateImageDto {
  @IsString()
  @IsNotEmpty()
  generateId: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsEnum(Size)
  size: Size;
}
