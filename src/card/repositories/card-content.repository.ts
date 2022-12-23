import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardContentDto } from '../dto/create-card-content.dto';
import { CardContent } from '../entities/card-content.entity';

@Injectable()
export class CardContentRepository extends Repository<CardContent> {
  constructor(private readonly dataSource: DataSource) {
    super(CardContent, dataSource.createEntityManager());
  }

  getMany(cardIdx: number): Promise<CardContent[]> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardContent, 'cc')
    .where('cc.cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

  async createCardContent(cardContentDto: CreateCardContentDto[]) {
    const { identifiers } = await this.dataSource.createQueryBuilder()
    .insert()
    .into(CardContent)
    .values(cardContentDto.map(dto => ({ ...dto, status: true })))
    .execute();
    return identifiers.map(r => r.idx);
  }

  deleteCardContent(cardIdx: number) {
    return this.dataSource.createQueryBuilder()
    .delete()
    .from(CardContent)
    .where('cardIdx = :cardIdx', { cardIdx })
    .execute();
  }

}
