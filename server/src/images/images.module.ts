import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { RecordsModule } from 'src/records/records.module';
import { BullModule } from '@nestjs/bull';
import { GenerateImageProcessor } from './images.process';

@Module({
  imports: [RecordsModule, BullModule.registerQueue({ name: 'generateImage' })],
  controllers: [ImagesController],
  providers: [ImagesService, GenerateImageProcessor],
})
export class ImagesModule {}
