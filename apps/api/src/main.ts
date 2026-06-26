import 'reflect-metadata';

import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { SafeExceptionFilter } from './common/filters/safe-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    origin: [/^http:\/\/localhost:5173$/, /^http:\/\/127\.0\.0\.1:5173$/]
  });
  app.enableVersioning({
    type: VersioningType.URI
  });
  app.useGlobalFilters(new SafeExceptionFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true
    })
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
}

void bootstrap();
