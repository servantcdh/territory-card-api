import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // dto에 명시되지 않은 파라미터는 받지 않음
      forbidNonWhitelisted: true, // dto에 명시되지 않은 파라미터로 요청이 오면 에러 반환
      transform: true, // 파라미터의 string 값을 실제 타입으로 변환
    }),
  );
  await app.listen(3000);
}
bootstrap();
