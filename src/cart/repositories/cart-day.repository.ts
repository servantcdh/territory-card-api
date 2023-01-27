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
    let qb = this.createQueryBuilder('cartDay').leftJoinAndSelect(
      'cartDay.cartDayTime',
      'cartDayTime',
    );
    if (dto.pageSize) {
      qb = qb.take(dto.getLimit()).skip(dto.getOffset());
    }
    return qb.getMany();
  }
}
