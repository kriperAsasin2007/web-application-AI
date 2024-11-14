import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Size, Status } from '@prisma/client';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  promptText: string;

  @IsOptional()
  generatedImageUrl: string;

  @IsDateString()
  @IsOptional()
  canceledAt?: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsEnum(Size)
  @IsOptional()
  size: Size;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  constructor(
    promptText: string,
    generatedImageUrl: string,
    status: Status,
    size: Size,
    userId: string,
    canceledAt?: string,
  ) {
    this.promptText = promptText;
    this.generatedImageUrl = generatedImageUrl;
    this.status = status;
    this.size = size;
    this.userId = userId;
    this.canceledAt = canceledAt;
  }
}
