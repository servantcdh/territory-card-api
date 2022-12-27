import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewAssigned } from 'src/assign/entities/crew-assigned.entity';
import { CrewAssignedRepository } from 'src/assign/repositories/crew-assigned.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CardRecord } from './entities/card-record.entity';
import { TerritoryRecordContent } from './entities/territory-record-content.entity';
import { TerritoryRecord } from './entities/territory-record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { CardRecordRepository } from './repositories/card-record.repository';
import { TerritoryRecordContentRepository } from './repositories/territory-record-content.repository';
import { TerritoryRecordRepository } from './repositories/territory-record.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardRecord,
      CrewAssigned,
      TerritoryRecord,
      TerritoryRecordContent,
      User,
    ]),
  ],
  controllers: [RecordController],
  providers: [
    RecordService,
    JwtStrategy,
    CardRecordRepository,
    CrewAssignedRepository,
    TerritoryRecordRepository,
    TerritoryRecordContentRepository,
    UserRepository,
  ],
})
export class RecordModule {}
