import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RecordsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createRecordDto: Prisma.RecordCreateInput) {
    return this.databaseService.record.create({
      data: createRecordDto,
    });
  }

  findAll() {
    return this.databaseService.record.findMany();
  }

  findOne(id: string) {
    return this.databaseService.record.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateRecordDto: Prisma.RecordUpdateInput) {
    return this.databaseService.record.update({
      where: {
        id,
      },
      data: updateRecordDto,
    });
  }

  remove(id: string) {
    return this.databaseService.record.delete({
      where: {
        id,
      },
    });
  }
}
