import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Size, Status } from '@prisma/client';
import Redis from 'ioredis';
import { CancelDto, GenerateImageDto } from './dto';
import { ClientClosedRequestException } from 'src/exceptions/ClientClosedRequestException';
import { RecordsService } from 'src/records/records.service';
import { CreateRecordDto } from 'src/records/dto/create-record.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly recordService: RecordsService,
    @InjectQueue('generateImage') private readonly generateImageQueue: Queue,
  ) {}

  async generateImage(userId: string, generateImageDto: GenerateImageDto) {
    console.log('Starting generating...');

    this.redis.set(`${generateImageDto.generateId}-status`, Status.PENDING);
    await this.generateImageQueue.add('generate-image-job', {
      userId,
      generateImageDto,
    });
  }

  async cancel(cancelDto: CancelDto) {
    console.log(`canceling ${cancelDto.generateId}`);
    await this.redis.set(`${cancelDto.generateId}-status`, Status.CANCELED);
    // await this.generateImageQueue.add('cancel-image-job', cancelDto);
  }
}
