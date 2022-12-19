import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './members/entities/members.entity';
import { Accesses } from './auth/entities/accesses.entity';
import { CardsModule } from './cards/cards.module';
import { RecordsModule } from './records/records.module';
import { AssignModule } from './assign/assign.module';
import { Cards } from './cards/entities/cards.entity';
import { CardContents } from './cards/entities/card-contents.entity';
import { CardTags } from './cards/entities/card-tags.entity';
import { CardsBackup } from './cards/entities/cards-backup.entity';
import { CardContentsBackup } from './cards/entities/card-contents-backup.entity';
import { CardTagsBackup } from './cards/entities/card-tags-backup.entity';
import { CardsAssigned } from './assign/entities/cards_assigned.entity';
import { CrewsAssigned } from './assign/entities/crews_assigned.entity';
import { CardRecords } from './records/entities/card-records.entity';
import { CardMarks } from './records/entities/card-marks.entity';
import { TerritoryRecords } from './records/entities/territory-records.entity';
import { TerritoryRecordContents } from './records/entities/territory-record-contents.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Members,
        Accesses,
        Cards,
        CardContents,
        CardTags,
        CardsBackup,
        CardContentsBackup,
        CardTagsBackup,
        CardsAssigned,
        CrewsAssigned,
        CardRecords,
        CardMarks,
        TerritoryRecords,
        TerritoryRecordContents
      ],
      logging: true,
      synchronize: true, // Be careful ㅜㅜㅜ 그치만 신기해
    }),
    AuthModule,
    MembersModule,
    CardsModule,
    RecordsModule,
    AssignModule,
  ],
  controllers: [AppController], // express.router
  providers: [AppService],
})
export class AppModule {}
