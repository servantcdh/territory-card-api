import { Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { DataSource, Repository } from 'typeorm';
import { CartDay } from '../entities/cart-day.entity';

@Injectable()
export class CartDayRepository extends Repository<CartDay> {
  constructor(private readonly dataSource: DataSource) {
    super(CartDay, dataSource.createEntityManager());
  }

  getMany(dto: PageRequestDto): Promise<CartDay[]> {
    let qb = this.createQueryBuilder('cartDay')
      .leftJoinAndSelect('cartDay.cartDayTime', 'cartDayTime')
      .leftJoinAndSelect(
        'cartDayTime.cartDayTimeUser',
        'cartDayTimeUser',
        'cartDayTimeUser.cartCrewAssignedIdx IS NULL',
      )
      .leftJoinAndSelect('cartDayTimeUser.user', 'user')
      .leftJoinAndSelect('user.access', 'access')
      .orderBy('cartDay.dayCode', 'ASC')
      .addOrderBy('cartDayTime.startTime', 'ASC');
    if (dto.pageSize) {
      qb = qb.take(dto.getLimit()).skip(dto.getOffset());
    }
    return qb.getMany();
  }

  getOne(dayCode: number): Promise<CartDay> {
    return this.createQueryBuilder('cartDay')
      .leftJoinAndSelect('cartDay.cartDayTime', 'cartDayTime')
      .leftJoinAndSelect(
        'cartDayTime.cartDayTimeLocation',
        'cartDayTimeLocation',
      )
      .leftJoinAndSelect('cartDayTimeLocation.cartLocation', 'cartLocation')
      .leftJoinAndSelect('cartDayTime.cartDayTimeUser', 'cartDayTimeUser')
      .leftJoinAndSelect('cartDayTimeUser.user', 'user')
      .leftJoinAndSelect('user.access', 'access')
      .where('cartDay.dayCode = :dayCode', { dayCode })
      .orderBy('user.name', 'ASC')
      .getOne();
  }
}
