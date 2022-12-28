import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardAssigned } from 'src/assign/entities/card-assigned.entity';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CardBackup } from 'src/card/entities/card-backup.entity';
import { CardContentBackup } from 'src/card/entities/card-content-backup.entity';
import { CardContent } from 'src/card/entities/card-content.entity';
import { CardTag } from 'src/card/entities/card-tag.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardBackupRepository } from 'src/card/repositories/card-backup.repository';
import { CardContentBackupRepository } from 'src/card/repositories/card-content-backup.repository';
import { CardContentRepository } from 'src/card/repositories/card-content.repository';
import { CardTagRepository } from 'src/card/repositories/card-tag.repository';
import { CardRepository } from 'src/card/repositories/card.repository';
import { TerritoryRecord } from 'src/record/entities/territory-record.entity';
import { TerritoryRecordRepository } from 'src/record/repositories/territory-record.repository';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Card,
      CardContent,
      CardTag,
      CardAssigned,
      CardBackup,
      CardContentBackup,
      TerritoryRecord
    ]),
  ],
  controllers: [FileController],
  providers: [
    JwtStrategy,
    FileService,
    CardRepository,
    CardContentRepository,
    CardTagRepository,
    CardAssignedRepository,
    CardBackupRepository,
    CardContentBackupRepository,
    TerritoryRecordRepository
  ],
})
export class FileModule {}
