import { IsNotEmpty, IsString } from 'class-validator';

export class CancelDto {
  @IsString()
  @IsNotEmpty()
  generateId: string;
}
