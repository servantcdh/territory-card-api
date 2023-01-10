import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardDto } from '../dto/create-card.dto';
import { GetCardDto } from '../dto/get-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { Card } from '../entities/card.entity';

@Injectable()
export class CardRepository extends Repository<Card> {
  constructor(private readonly dataSource: DataSource) {
    super(Card, dataSource.createEntityManager());
  }

  getOne(idx: number): Promise<Card> {
    return this.createQueryBuilder('card')
      .leftJoinAndSelect(
        'card.cardAssigned',
        'cardAssigned',
        'cardAssigned.dateCompleted > :now',
        { now: new Date(new Date().getFullYear() + '-01-01') },
      )
      .leftJoinAndSelect('card.cardContent', 'cardContent')
      .where('card.idx = :idx', { idx })
      .getOne();
  }

  async getMany(dto: GetCardDto): Promise<Card[]> {
    const tags = dto.getTags();
    const tagsIgnored = dto.getTagsIgnored();
    let qb = this.createQueryBuilder('card')
      .leftJoinAndSelect(
        'card.cardAssigned',
        'cardAssigned',
        'cardAssigned.dateCompleted > :now',
        { now: new Date(new Date().getFullYear() + '-01-01') },
      )
      .leftJoinAndSelect('card.cardContent', 'cardContent')
      .where('cardAssigned.dateCompleted IS NOT NULL')
      .orWhere('cardAssigned.dateAssigned IS NULL');
    if (tags.length) {
      tags.forEach((tag, idx) => {
        const key = `tag${idx}`;
        const params = {};
        params[key] = tag;
        qb = qb.andWhere(`card.memo REGEXP :${key}`, params);
      });
    }
    if (tagsIgnored.length) {
      tagsIgnored.forEach((tag, idx) => {
        const key = `ignored${idx}`;
        const params = {};
        params[key] = tag;
        qb = qb.andWhere(`card.memo NOT REGEXP :${key}`, params);
      });
    }
    return qb.take(dto.getLimit()).skip(dto.getOffset()).getMany();
  }

  async createCard(cardDto: CreateCardDto) {
    try {
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
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateCard(cardDto: UpdateCardDto) {
    try {
      const { idx, ...dto } = cardDto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set(dto)
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
