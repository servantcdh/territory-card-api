import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardTagBackup } from '../entities/card-tag-backup.entity';
import { CreateCardTagBackupDto } from '../dto/create-card-tag-backup.dto';

@Injectable()
export class CardTagBackupRepository extends Repository<CardTagBackup> {
  constructor(private readonly dataSource: DataSource) {
    super(CardTagBackup, dataSource.createEntityManager());
  }

  getMany(cardIdx: number): Promise<CardTagBackup[]> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardTagBackup, 'ctb')
    .where('ctb.cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

  async createCardTagBackup(cardTagBackupDto: CreateCardTagBackupDto[]) {
    const { identifiers } = await this.dataSource.createQueryBuilder()
    .insert()
    .into(CardTagBackup)
    .values(cardTagBackupDto)
    .execute();
    return identifiers;
  }

  deleteCardTagBackup(cardIdx: number) {
    return this.dataSource.createQueryBuilder()
    .delete()
    .from(CardTagBackup)
    .where('cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

}
