import { Module, Logger } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RecordsController],
  providers: [RecordsService, Logger],
})
export class RecordsModule {}
