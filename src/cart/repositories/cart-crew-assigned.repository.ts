import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCartCrewAssignedDto } from '../dto/create-cart-crew-assigned.dto';
import { CartCrewAssigned } from '../entities/cart-crew-assigned.entity';

@Injectable()
export class CartCrewAssignedRepository extends Repository<CartCrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CartCrewAssigned, dataSource.createEntityManager());
  }

  async createCrew(dto: CreateCartCrewAssignedDto) {
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

  async deleteCrew(cartCrewAssignedIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartCrewAssigned)
      .where('idx = :idx', { idx: cartCrewAssignedIdx })
      .execute();
    return affected;
  }
}
