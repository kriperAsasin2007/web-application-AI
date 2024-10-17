import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [UsersModule, DatabaseModule, RecordsModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
