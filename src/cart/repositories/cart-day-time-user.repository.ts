import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCartDayTimeUserDto } from '../dto/create-cart-day-time-user.dto';
import { UpdateCartDayTimeUserDto } from '../dto/update-cart-day-time-user.dto';
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

  async updateTimeUser(dto: UpdateCartDayTimeUserDto) {
    try {
      const { cartDayTimeUserIdx: idx, ...updateDto } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CartDayTimeUser)
        .set(updateDto)
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateTimeUserAssignNull(idx: number) {
    try {
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CartDayTimeUser)
        .set({
          cartCrewAssignedIdx: null,
        })
        .where('cartCrewAssignedIdx = :idx', { idx })
        .execute();
      return affected;
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

  async deleteTimeUsers(cartDayTimeIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartDayTimeUser)
      .where('cartDayTimeIdx = :idx', { idx: cartDayTimeIdx })
      .execute();
    return affected;
  }
}
