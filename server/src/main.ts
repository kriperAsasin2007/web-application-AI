import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { instance } from 'logger/winston.logger';
import { AppModule } from './app.module';
import { corsOptions } from './config/corsConfig';
import { AllExceptionsFilter } from './all-exceptions.filter';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors(corsOptions);
  await app.listen(PORT);
}
bootstrap();
