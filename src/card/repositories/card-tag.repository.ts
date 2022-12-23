import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardTagDto } from '../dto/create-card-tag.dto';
import { CardTag } from '../entities/card-tag.entity';

@Injectable()
export class CardTagRepository extends Repository<CardTag> {
  constructor(private readonly dataSource: DataSource) {
    super(CardTag, dataSource.createEntityManager());
  }

  getMany(cardIdx: number): Promise<CardTag[]> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardTag, 'ct')
    .where('ct.cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

  async createCardTag(cardTagDto: CreateCardTagDto[]) {
    const { identifiers } = await this.dataSource.createQueryBuilder()
    .insert()
    .into(CardTag)
    .values(cardTagDto)
    .execute();
    return identifiers.map(r => r.idx);
  }

  deleteCardTag(cardIdx: number) {
    return this.dataSource.createQueryBuilder()
    .delete()
    .from(CardTag)
    .where('cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

}
