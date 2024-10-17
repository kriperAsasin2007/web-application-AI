import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  promptText: string;

  @IsString()
  @IsNotEmpty()
  generatedImageUrl: string;

  @IsDateString()
  @IsOptional()
  canceledAt?: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
