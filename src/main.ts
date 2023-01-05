import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // dto에 명시되지 않은 파라미터는 받지 않음
      forbidNonWhitelisted: true, // dto에 명시되지 않은 파라미터로 요청이 오면 에러 반환
      transform: true, // 파라미터의 string 값을 실제 타입으로 변환
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
