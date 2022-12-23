import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardBackup } from '../entities/card-backup.entity';
import { CreateCardBackupDto } from '../dto/create-card-backup.dto';

@Injectable()
export class CardBackupRepository extends Repository<CardBackup> {
  constructor(private readonly dataSource: DataSource) {
    super(CardBackup, dataSource.createEntityManager());
  }

  getOne(idx: number): Promise<CardBackup> {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(CardBackup, 'cb')
      .where('cb.idx = :idx', { idx })
      .getRawOne();
  }

  async createCardBackup(cardDto: CreateCardBackupDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardBackup)
        .values([cardDto])
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  deleteCardBackup(cardIdx: number) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CardBackup)
      .where('cardIdx = :cardIdx', { cardIdx })
      .execute();
  }
}
