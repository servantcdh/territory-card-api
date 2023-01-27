import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCartDayTimeLocationDto } from '../dto/create-cart-day-time-location.dto';
import { CartDayTimeLocation } from '../entities/cart-day-time-location.entity';

@Injectable()
export class CartDayTimeLocationRepository extends Repository<CartDayTimeLocation> {
  constructor(private readonly dataSource: DataSource) {
    super(CartDayTimeLocation, dataSource.createEntityManager());
  }

  async createTimeLocation(dto: CreateCartDayTimeLocationDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CartDayTimeLocation)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteTimeLocation(cartDayTimeLocationIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartDayTimeLocation)
      .where('idx = :idx', { idx: cartDayTimeLocationIdx })
      .execute();
    return affected;
  }
}
