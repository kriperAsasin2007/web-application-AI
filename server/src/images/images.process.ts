import { InjectRedis } from '@nestjs-modules/ioredis';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Size, Status } from '@prisma/client';
import { Job } from 'bull';
import Redis from 'ioredis';
import OpenAI from 'openai';
import { ClientClosedRequestException } from 'src/exceptions/ClientClosedRequestException';
import { CreateRecordDto } from 'src/records/dto/create-record.dto';
import { RecordsService } from 'src/records/records.service';

@Processor('generateImage')
export class GenerateImageProcessor {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly recordsService: RecordsService,
  ) {}

  openAIClient = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

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

  @Process({ name: 'generate-image-job', concurrency: 4 })
  async handleGenerateImage(job: Job) {
    const { userId, generateImageDto } = job.data;
    const step = 10;

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
        this.recordsService.create(recordDto);
        throw new ClientClosedRequestException('Cancel exception');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.redis.del(`${generateImageDto.generateId}-status`);
    console.log({ generateImageDto });

    // try {
    //   const response = await this.openAIClient.images.generate({
    //     model: 'dall-e-2',
    //     prompt: generateImageDto.prompt,
    //     n: 1,
    //     size: this.getSize(generateImageDto.size),
    //   });

    //   const imageUrl = response.data[0].url;

    //   const recordDto = new CreateRecordDto(
    //     generateImageDto.prompt,
    //     imageUrl,
    //     Status.DONE,
    //     generateImageDto.size,
    //     userId,
    //   );
    //   console.log({ recordDto });
    //   this.recordsService.create(recordDto);
    //   console.log('Long operation finished.');
    //   return { imageUrl, prompt: generateImageDto.prompt };
    // } catch (error) {
    //   throw new Error(`Error during generating images ${error}`);
    // }
  }

  //   @Process('cancel-image-job')
  //   async handleCancel(job: Job) {
  //     const { cancelDto } = job.data;

  //   }

  //   @OnQueueCompleted()
  //   onComplete(job: Job) {
  //     console.log('job completed');
  //     console.log({ job });
  //   }
}
