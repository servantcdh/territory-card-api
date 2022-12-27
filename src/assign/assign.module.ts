import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CardRecord } from 'src/record/entities/card-record.entity';
import { TerritoryRecordContent } from 'src/record/entities/territory-record-content.entity';
import { TerritoryRecord } from 'src/record/entities/territory-record.entity';
import { CardRecordRepository } from 'src/record/repositories/card-record.repository';
import { TerritoryRecordContentRepository } from 'src/record/repositories/territory-record-content.repository';
import { TerritoryRecordRepository } from 'src/record/repositories/territory-record.repository';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AssignController } from './assign.controller';
import { AssignService } from './assign.service';
import { CardAssigned } from './entities/card-assigned.entity';
import { CrewAssigned } from './entities/crew-assigned.entity';
import { CardAssignedRepository } from './repositories/card-assigned.repository';
import { CrewAssignedRepository } from './repositories/crew-assigned.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardAssigned,
      CrewAssigned,
      CardRecord,
      TerritoryRecord,
      TerritoryRecordContent,
      User,
    ]),
  ],
  controllers: [AssignController],
  providers: [
    AssignService,
    JwtStrategy,
    CardAssignedRepository,
    CrewAssignedRepository,
    CardRecordRepository,
    TerritoryRecordRepository,
    TerritoryRecordContentRepository,
    UserRepository,
  ],
})
export class AssignModule {}
