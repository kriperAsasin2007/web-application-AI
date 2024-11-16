import { Module, Logger } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { RecordsModule } from './records/records.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { AuthService } from './auth/auth.service';
import { ImagesModule } from './images/images.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    RecordsModule,
    DatabaseModule,
    AuthModule,
    ImagesModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number.parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    Logger,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
