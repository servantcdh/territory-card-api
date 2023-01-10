import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardAssigned } from 'src/assign/entities/card-assigned.entity';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardBackup } from './entities/card-backup.entity';
import { CardContentBackup } from './entities/card-content-backup.entity';
import { CardContent } from './entities/card-content.entity';
import { CardTag } from './entities/card-tag.entity';
import { Card } from './entities/card.entity';
import { CardBackupRepository } from './repositories/card-backup.repository';
import { CardContentBackupRepository } from './repositories/card-content-backup.repository';
import { CardContentRepository } from './repositories/card-content.repository';
import { CardTagRepository } from './repositories/card-tag.repository';
import { CardRepository } from './repositories/card.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Card,
      CardContent,
      CardTag,
      CardBackup,
      CardContentBackup,
      CardAssigned,
    ]),
  ],
  controllers: [CardController],
  providers: [
    CardService,
    JwtStrategy,
    CardRepository,
    CardContentRepository,
    CardTagRepository,
    CardBackupRepository,
    CardContentBackupRepository,
    CardAssignedRepository,
  ],
})
export class CardModule {}
