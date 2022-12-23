import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardAssigned } from '../entities/card-assigned.entity';

@Injectable()
export class CardAssignedRepository extends Repository<CardAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CardAssigned, dataSource.createEntityManager());
  }

  getOne(cardIdx: number): Promise<CardAssigned> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardAssigned, 'ca')
    .where('ca.cardIdx = :cardIdx', { cardIdx })
    .getRawOne();
  }

}
