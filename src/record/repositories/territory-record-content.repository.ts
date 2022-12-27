import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTerritoryRecordContentDto } from '../dto/create-territory-record-content.dto';
import { TerritoryRecordContent } from '../entities/territory-record-content.entity';

@Injectable()
export class TerritoryRecordContentRepository extends Repository<TerritoryRecordContent> {
  constructor(private readonly dataSource: DataSource) {
    super(TerritoryRecordContent, dataSource.createEntityManager());
  }

  async createTerritoryRecordContent(TerritoryRecordContentDto: CreateTerritoryRecordContentDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(TerritoryRecordContent)
        .values(TerritoryRecordContentDto)
        .execute();
      return identifiers.map((r) => r.idx);
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

}
