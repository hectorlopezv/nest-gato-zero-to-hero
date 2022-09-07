import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { transformerInterceptor } from './transform.interceptor';

async function bootstrap() {
  const looger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new transformerInterceptor());
  const port = process.env.PORT || 3000;

  await app.listen(port);
  looger.log(`Application listening on port ${port}`);
}
bootstrap();
