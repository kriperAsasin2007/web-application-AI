import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

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

  async update(id: string, updateRecordDto: UpdateRecordDto) {
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
