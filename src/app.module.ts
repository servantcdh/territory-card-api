import * as Joi from 'joi';
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
import { CardTagBackup } from './card/entities/card-tag-backup.entity';
import { CardAssigned } from './assign/entities/card_assigned.entity';
import { CrewAssigned } from './assign/entities/crew_assigned.entity';
import { CardRecord } from './record/entities/card-record.entity';
import { CardMark } from './record/entities/card-mark.entity';
import { TerritoryRecord } from './record/entities/territory-record.entity';
import { TerritoryRecordContent } from './record/entities/territory-record-content.entity';

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
      }),
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
        CardTagBackup,
        CardAssigned,
        CrewAssigned,
        CardRecord,
        CardMark,
        TerritoryRecord,
        TerritoryRecordContent,
      ],
      logging: true,
      synchronize: true, // Be careful ㅜㅜㅜ 그치만 신기해
    }),
    AuthModule,
    UserModule,
    CardModule,
    RecordModule,
    AssignModule,
  ],
  controllers: [AppController], // express.router
  providers: [AppService],
})
export class AppModule {}
