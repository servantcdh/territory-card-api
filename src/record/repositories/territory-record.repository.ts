import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTerritoryRecordDto } from '../dto/create-territory-record.dto';
import { UpdateTerritoryRecordDto } from '../dto/update-territory-record.dto';
import { TerritoryRecord } from '../entities/territory-record.entity';

@Injectable()
export class TerritoryRecordRepository extends Repository<TerritoryRecord> {
  constructor(private readonly dataSource: DataSource) {
    super(TerritoryRecord, dataSource.createEntityManager());
  }

  getOne(serviceYear: number, cardIdx: number): Promise<TerritoryRecord> {
    return this.createQueryBuilder('territoryRecord')
      .leftJoinAndSelect(
        'territoryRecord.card',
        'card',
      )
      .leftJoinAndSelect(
        'territoryRecord.territoryRecordContent',
        'territoryRecordContent',
      )
      .leftJoinAndSelect(
        'territoryRecordContent.user',
        'user',
      )
      .where('territoryRecord.serviceYear = :serviceYear', { serviceYear })
      .andWhere('territoryRecord.cardIdx = :cardIdx', { cardIdx })
      .getOne();
  }

  getMany(serviceYear: number): Promise<TerritoryRecord[]> {
    return this.createQueryBuilder('territoryRecord')
      .leftJoinAndSelect(
        'territoryRecord.card',
        'card',
      )
      .leftJoinAndSelect(
        'territoryRecord.territoryRecordContent',
        'territoryRecordContent',
      )
      .leftJoinAndSelect(
        'territoryRecordContent.user',
        'user',
      )
      .where('territoryRecord.serviceYear = :serviceYear', { serviceYear })
      .getMany();
  }

  async createTerritoryRecord(dto: CreateTerritoryRecordDto): Promise<number> {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(TerritoryRecord)
        .values(dto)
        .execute();
      const { idx } = identifiers[0];
      return idx;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateTerritoryRecord(dto: UpdateTerritoryRecordDto) {
    try {
      const { territoryRecordIdx: idx, lastDateCompleted } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(TerritoryRecord)
        .set({ lastDateCompleted })
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
