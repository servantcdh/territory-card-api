import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCartDayTimeUserDto } from '../dto/create-cart-day-time-user.dto';
import { CartDayTimeUser } from '../entities/cart-day-time-user.entity';

@Injectable()
export class CartDayTimeUserRepository extends Repository<CartDayTimeUser> {
  constructor(private readonly dataSource: DataSource) {
    super(CartDayTimeUser, dataSource.createEntityManager());
  }

  async createTimeUser(dto: CreateCartDayTimeUserDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CartDayTimeUser)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteTimeUser(cartDayTimeUserIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartDayTimeUser)
      .where('idx = :idx', { idx: cartDayTimeUserIdx })
      .execute();
    return affected;
  }
}
