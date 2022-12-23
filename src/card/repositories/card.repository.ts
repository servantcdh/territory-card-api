import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { Card } from '../entities/card.entity';

@Injectable()
export class CardRepository extends Repository<Card> {
  constructor(private readonly dataSource: DataSource) {
    super(Card, dataSource.createEntityManager());
  }

  getOne(idx: number): Promise<Card> {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(Card, 'c')
      .where('c.idx = :idx', { idx })
      .getRawOne();
  }

  async createCard(cardDto: CreateCardDto) {
    try {
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
    const { identifiers } = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values([
        {
          ...cardDto,
          status: true,
        },
      ])
      .execute();
    const { idx } = identifiers[0];
    return idx;
  }

  async updateCard(cardDto: UpdateCardDto) {
    try {
      const { idx, name, memo, status } = cardDto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set({
          name,
          memo,
          status,
        })
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
