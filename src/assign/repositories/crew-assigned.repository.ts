import { ForbiddenException, Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CrewAssigned } from '../entities/crew-assigned.entity';

@Injectable()
export class CrewAssignedRepository extends Repository<CrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CrewAssigned, dataSource.createEntityManager());
  }

  getAssignedCrew(cardAssignedIdx: number) {
    return this.createQueryBuilder('crewAssigned')
      .select()
      .where('crewAssigned.cardAssignedIdx = :cardAssignedIdx', {
        cardAssignedIdx,
      })
      .getMany();
  }

  async assignCrew(dto: { cardAssignedIdx: number; userIdx: number }[]) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CrewAssigned)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteCrew(dto: { cardAssignedIdx: number; userIdx: number }[]) {
    try {
      let qb = this.createQueryBuilder('crewAssigned').delete();
      dto.forEach((d, i) => {
        const { cardAssignedIdx, userIdx } = d;
        const params: any = {};
        params[`cardAssignedIdx${i}`] = cardAssignedIdx;
        params[`userIdx${i}`] = userIdx;
        qb = qb.orWhere(
          new Brackets((q) => {
            q.orWhere(
              `cardAssignedIdx = :cardAssignedIdx${i} AND userIdx = :userIdx${i}`,
              params,
            );
          }),
        );
      });
      const { affected } = await qb.execute();
      return affected;
    } catch (e) {
      // console.log(e);
      return 0;
    }
  }
}
