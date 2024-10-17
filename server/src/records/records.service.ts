import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createRecordDto: CreateRecordDto) {
    if (!createRecordDto) throw new BadRequestException("User can't be null");
    return this.databaseService.record.create({
      data: {
        promptText: createRecordDto.promptText,
        generatedImageUrl: createRecordDto.generatedImageUrl,
        canceledAt: createRecordDto.canceledAt,
        status: createRecordDto.status,
        user: {
          connect: { id: createRecordDto.userId },
        },
      },
    });
  }

  async findAll() {
    return this.databaseService.record.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.record.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateRecordDto: Prisma.RecordUpdateInput) {
    return this.databaseService.record.update({
      where: {
        id,
      },
      data: updateRecordDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.record.delete({
      where: {
        id,
      },
    });
  }
}
