import * as Joi from 'joi';
import * as path from 'path';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Access } from './auth/entities/access.entity';
import { CardModule } from './card/card.module';
import { RecordModule } from './record/record.module';
import { AssignModule } from './assign/assign.module';
import { Card } from './card/entities/card.entity';
import { CardContent } from './card/entities/card-content.entity';
import { CardTag } from './card/entities/card-tag.entity';
import { CardBackup } from './card/entities/card-backup.entity';
import { CardContentBackup } from './card/entities/card-content-backup.entity';
import { CardAssigned } from './assign/entities/card-assigned.entity';
import { CrewAssigned } from './assign/entities/crew-assigned.entity';
import { CardRecord } from './record/entities/card-record.entity';
import { CardMark } from './record/entities/card-mark.entity';
import { TerritoryRecord } from './record/entities/territory-record.entity';
import { TerritoryRecordContent } from './record/entities/territory-record-content.entity';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FirebaseService } from './shared/services/firebase/firebase.service';
import { CartModule } from './cart/cart.module';
import { CartDay } from './cart/entities/cart-day.entity';
import { CartDayTime } from './cart/entities/cart-day-time.entity';
import { CartDayTimeLocation } from './cart/entities/cart-day-time-location.entity';
import { CartDayTimeUser } from './cart/entities/cart-day-time-user.entity';
import { CartLocation } from './cart/entities/cart-location.entity';
import { CartCrewAssigned } from './cart/entities/cart-crew-assigned.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required().default('dev'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Access,
        Card,
        CardContent,
        CardTag,
        CardBackup,
        CardContentBackup,
        CardAssigned,
        CrewAssigned,
        CardRecord,
        CardMark,
        TerritoryRecord,
        TerritoryRecordContent,
        CartLocation,
        CartDay,
        CartDayTime,
        CartDayTimeLocation,
        CartDayTimeUser,
        CartCrewAssigned,
      ],
      timezone: 'Asia/Seoul',
      logging: false,
      synchronize: process.env.NODE_ENV === 'dev', // Be careful ㅜㅜㅜ 그치만 신기해
    }),
    AuthModule,
    UserModule,
    CardModule,
    RecordModule,
    AssignModule,
    FileModule,
    CartModule,
  ],
  controllers: [AppController], // express.router
  providers: [AppService, FirebaseService],
})
export class AppModule {}
