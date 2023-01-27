import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCartDayTimeDto } from '../dto/create-cart-day-time.dto';
import { UpdateCartDayTimeDto } from '../dto/update-cart-day-time.dto';
import { CartDayTime } from '../entities/cart-day-time.entity';

@Injectable()
export class CartDayTimeRepository extends Repository<CartDayTime> {
  constructor(private readonly dataSource: DataSource) {
    super(CartDayTime, dataSource.createEntityManager());
  }

  getOne(cartDayTimeIdx: number): Promise<CartDayTime> {
    return this.createQueryBuilder('cartDayTime')
      .leftJoinAndSelect(
        'cartDayTime.cartDayTimeLocation',
        'cartDayTimeLocation',
      )
      .leftJoinAndSelect('cartDayTimeLocation.cartCrewAssigned', 'cartCrewAssigned')
      .leftJoinAndSelect('cartCrewAssigned.cartDayTimeUser', 'crew')
      .leftJoinAndSelect('crew.user', 'crewInfo')
      .leftJoinAndSelect('crewInfo.access', 'crewAccess')
      .leftJoinAndSelect('cartDayTimeLocation.cartLocation', 'cartLocation')
      .leftJoinAndSelect('cartDayTime.cartDayTimeUser', 'cartDayTimeUser')
      .leftJoinAndSelect('cartDayTimeUser.user', 'user')
      .leftJoinAndSelect('user.access', 'access')
      .where('cartDayTime.idx = :cartDayTimeIdx', { cartDayTimeIdx })
      .getOne();
  }

  async createTime(dto: CreateCartDayTimeDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CartDayTime)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateTime(dto: UpdateCartDayTimeDto) {
    try {
      const { cartDayTimeIdx: idx, ...updateDto } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CartDayTime)
        .set(updateDto)
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteTime(cartDayTimeIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartDayTime)
      .where('idx = :idx', { idx: cartDayTimeIdx })
      .execute();
    return affected;
  }
}
