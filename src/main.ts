import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const whitelist = ['https://www.jwterritory.co.kr', 'http://localhost:4200'];

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
  app.enableCors({
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
