import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Size, Status } from '@prisma/client';
import Redis from 'ioredis';
import { CancelDto, GenerateImageDto } from './dto';
import { ClientClosedRequestException } from 'src/exceptions/ClientClosedRequestException';
import { RecordsService } from 'src/records/records.service';
import { CreateRecordDto } from 'src/records/dto/create-record.dto';

@Injectable()
export class ImagesService {
  openAIClient = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly recordService: RecordsService,
  ) {}

  getSize(size: Size) {
    switch (size) {
      case Size.LARGE:
        return '1024x1024';
      case Size.MEDIUM:
        return '512x512';
      case Size.SMALL:
        return '256x256';
    }
  }

  async generateImage(userId: string, generateImageDto: GenerateImageDto) {
    console.log('Starting generating...');

    this.redis.set(`${generateImageDto.generateId}-status`, Status.PENDING);
    const step = 25;

    for (let i = 0; i < step; i++) {
      const status = await this.redis.get(
        `${generateImageDto.generateId}-status`,
      );
      console.log({ status });
      if (status === Status.CANCELED) {
        const recordDto = new CreateRecordDto(
          generateImageDto.prompt,
          null,
          Status.CANCELED,
          null,
          userId,
        );
        console.log({ recordDto });
        this.recordService.create(recordDto);
        throw new ClientClosedRequestException('Cancel exception');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.redis.del(`${generateImageDto.generateId}-status`);
    console.log({ generateImageDto });

    try {
      const response = await this.openAIClient.images.generate({
        model: 'dall-e-2',
        prompt: generateImageDto.prompt,
        n: 1,
        size: this.getSize(generateImageDto.size),
      });

      const imageUrl = response.data[0].url;

      const recordDto = new CreateRecordDto(
        generateImageDto.prompt,
        imageUrl,
        Status.DONE,
        generateImageDto.size,
        userId,
      );
      console.log({ recordDto });
      this.recordService.create(recordDto);
      console.log('Long operation finished.');
      return { imageUrl, prompt: generateImageDto.prompt };
    } catch (error) {
      throw new Error(`Error during generating images ${error}`);
    }
  }

  async cancel(cancelDto: CancelDto) {
    console.log(`canceling ${cancelDto.generateId}`);
    this.redis.set(`${cancelDto.generateId}-status`, Status.CANCELED);
  }
}
