import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardAssigned } from 'src/assign/entities/card-assigned.entity';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { CardBackup } from 'src/card/entities/card-backup.entity';
import { CardContentBackup } from 'src/card/entities/card-content-backup.entity';
import { CardContent } from 'src/card/entities/card-content.entity';
import { CardTagBackup } from 'src/card/entities/card-tag-backup.entity';
import { CardTag } from 'src/card/entities/card-tag.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardBackupRepository } from 'src/card/repositories/card-backup.repository';
import { CardContentBackupRepository } from 'src/card/repositories/card-content-backup.repository';
import { CardContentRepository } from 'src/card/repositories/card-content.repository';
import { CardTagBackupRepository } from 'src/card/repositories/card-tag-backup.repository';
import { CardTagRepository } from 'src/card/repositories/card-tag.repository';
import { CardRepository } from 'src/card/repositories/card.repository';
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
      CardTagBackup,
    ]),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    CardRepository,
    CardContentRepository,
    CardTagRepository,
    CardAssignedRepository,
    CardBackupRepository,
    CardContentBackupRepository,
    CardTagBackupRepository
  ],
})
export class FileModule {}
