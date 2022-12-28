import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardRecordDto } from '../dto/create-card-record.dto';
import { GetCardRecordDto } from '../dto/get-card-record.dto';
import { CardRecord } from '../entities/card-record.entity';

@Injectable()
export class CardRecordRepository extends Repository<CardRecord> {
  constructor(private readonly dataSource: DataSource) {
    super(CardRecord, dataSource.createEntityManager());
  }

  async getMany(dto: GetCardRecordDto): Promise<CardRecord[]> {
    return this.createQueryBuilder('cardRecord')
      .leftJoinAndSelect('cardRecord.cardMark', 'cardMark')
      .leftJoinAndSelect('cardRecord.cardAssigned', 'cardAssigned')
      .leftJoinAndSelect('cardRecord.crewAssigned', 'crewAssigned')
      .leftJoinAndSelect('crewAssigned.user', 'user')
      .where('cardAssigned.idx = :idx', { idx: dto.cardAssignedIdx })
      .getMany();
  }

  async createCardRecord(dto: CreateCardRecordDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardRecord)
        .values(dto)
        .execute();
      const { idx } = identifiers[0];
      return idx;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateCardRecord(dto: CreateCardRecordDto) {
    try {
      const { cardAssignedIdx, cardContentIdx, cardMarkIdx } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CardRecord)
        .set({ cardMarkIdx })
        .where(
          'cardAssignedIdx = :cardAssignedIdx AND cardContentIdx = :cardContentIdx',
          { cardAssignedIdx, cardContentIdx },
        )
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
