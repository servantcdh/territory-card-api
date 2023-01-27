import { ForbiddenException, Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CartCrewAssigned } from '../entities/cart-crew-assigned.entity';

@Injectable()
export class CartCrewAssignedRepository extends Repository<CartCrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CartCrewAssigned, dataSource.createEntityManager());
  }

  async createCrew(
    dto: { cartDayTimeLocationIdx: number; cartDayTimeUserIdx: number }[],
  ) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CartCrewAssigned)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteCrew(
    dto: { cartDayTimeLocationIdx: number; cartDayTimeUserIdx: number }[],
  ) {
    try {
      let qb = this.createQueryBuilder('cartCrewAssigned').delete();
      dto.forEach((d, i) => {
        const { cartDayTimeLocationIdx, cartDayTimeUserIdx } = d;
        const params: any = {};
        params[`cartDayTimeLocationIdx${i}`] = cartDayTimeLocationIdx;
        params[`cartDayTimeUserIdx${i}`] = cartDayTimeUserIdx;
        qb = qb.orWhere(
          new Brackets((q) => {
            q.orWhere(
              `cartDayTimeLocationIdx = :cartDayTimeLocationIdx${i} AND cartDayTimeUserIdx = :cartDayTimeUserIdx${i}`,
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
