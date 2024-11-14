import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { RecordsModule } from 'src/records/records.module';

@Module({
  imports: [RecordsModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
