import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardContentBackup } from '../entities/card-content-backup.entity';
import { CreateCardContentBackupDto } from '../dto/create-card-content-backup.dto';

@Injectable()
export class CardContentBackupRepository extends Repository<CardContentBackup> {
  constructor(private readonly dataSource: DataSource) {
    super(CardContentBackup, dataSource.createEntityManager());
  }

  getMany(cardIdx: number): Promise<CardContentBackup[]> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardContentBackup, 'ccb')
    .where('ccb.cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

  async createCardContentBackup(cardContentBackupDto: CreateCardContentBackupDto[]) {
    const { identifiers } = await this.dataSource.createQueryBuilder()
    .insert()
    .into(CardContentBackup)
    .values(cardContentBackupDto)
    .execute();
    return identifiers;
  }

  deleteCardContentBackup(cardIdx: number) {
    return this.dataSource.createQueryBuilder()
    .delete()
    .from(CardContentBackup)
    .where('cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

}
