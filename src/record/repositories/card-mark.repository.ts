import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardMark } from '../entities/card-mark.entity';

@Injectable()
export class CardMarkRepository extends Repository<CardMark> {
  constructor(private readonly dataSource: DataSource) {
    super(CardMark, dataSource.createEntityManager());
  }
}
