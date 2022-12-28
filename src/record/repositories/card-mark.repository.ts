import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardMark } from '../entities/card-mark.entity';

@Injectable()
export class CardMarkRepository extends Repository<CardMark> {

  constructor(private readonly dataSource: DataSource) {
    super(CardMark, dataSource.createEntityManager());
  }

  async getOneByMarkName(name: string): Promise<CardMark> {
    return this.createQueryBuilder('cardMark')
      .where('cardMark.name = :name', { name })
      .getOne();
  }
}
