import { ForbiddenException, Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateAssignedCardDto } from '../dto/create-assigned-card.dto';
import { GetAssignedCardDto } from '../dto/get-assigned-card.dto';
import { UpdateAssignedCardDto } from '../dto/update-assigned-card.dto';
import { CardAssigned } from '../entities/card-assigned.entity';

@Injectable()
export class CardAssignedRepository extends Repository<CardAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CardAssigned, dataSource.createEntityManager());
  }

  getOne(cardAssigned: number): Promise<CardAssigned> {
    return this.createQueryBuilder('cardAssigned')
    .leftJoinAndSelect('cardAssigned.card', 'card')
    .leftJoinAndSelect('card.cardContent', 'cardContent')
    .leftJoinAndSelect('cardContent.cardRecord', 'cardRecord')
    .leftJoinAndSelect('cardAssigned.crewAssigned', 'crewAssigned')
    .leftJoinAndSelect('crewAssigned.user', 'user')
    .where('cardAssigned.idx = :cardAssigned', { cardAssigned })
    .getOne();
  }

  getOneNotComplete(cardIdx: number): Promise<CardAssigned> {
    return this.dataSource.createQueryBuilder()
    .select()
    .from(CardAssigned, 'ca')
    .where('ca.cardIdx = :cardIdx AND ca.dateCompleted IS NULL', { cardIdx })
    .getRawOne();
  }

  getMany(dto: PageRequestDto): Promise<CardAssigned[]> {
    let qb = this.createQueryBuilder('cardAssigned')
    .leftJoinAndSelect('cardAssigned.card', 'card')
    .leftJoinAndSelect('cardAssigned.crewAssigned', 'crewAssigned')
    .leftJoinAndSelect('crewAssigned.user', 'user')
    .where('cardAssigned.dateCompleted IS NULL');
    return qb.take(dto.getLimit()).skip(dto.getOffset()).getMany();
  }

  async getManyToMe(dto: GetAssignedCardDto): Promise<CardAssigned[]> {
    const { idx } = await this.createQueryBuilder()
    .subQuery()
    .select('cardAssigned.idx')
    .from(CardAssigned, 'cardAssigned')
    .leftJoinAndSelect('cardAssigned.crewAssigned', 'crewAssigned')
    .where('crewAssigned.userIdx = :userIdx', { userIdx: dto.userIdx })
    .getOne();
    return this.createQueryBuilder('cardAssigned')
    .leftJoinAndSelect('cardAssigned.card', 'card')
    .leftJoinAndSelect('cardAssigned.crewAssigned', 'crewAssigned')
    .leftJoinAndSelect('crewAssigned.user', 'user')
    .where('cardAssigned.idx = :idx', { idx })
    .getMany();
  }

  async createAssignedCard(dto: CreateAssignedCardDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardAssigned)
        .values([dto])
        .execute();
      const { idx } = identifiers[0];
      return idx;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateAssignedCard(dto: UpdateAssignedCardDto) {
    try {
      const { cardAssignedIdx: idx, userIdx, dateCompleted } = dto;
      const values: UpdateAssignedCardDto = {};
      if (userIdx) {
        values.userIdx = userIdx;
      }
      if (dateCompleted) {
        values.dateCompleted = dateCompleted;
      }
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CardAssigned)
        .set(values)
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
    
  }

  async deleteAssignedCard(cardAssignedIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CardAssigned)
      .where('idx = :idx', { idx: cardAssignedIdx })
      .execute();
    return affected;
  }

}
