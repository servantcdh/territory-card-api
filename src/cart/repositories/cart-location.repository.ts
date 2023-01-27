import { ForbiddenException, Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateCartLocationDto } from '../dto/create-cart-location.dto';
import { UpdateCartLocationDto } from '../dto/update-cart-location.dto';
import { CartLocation } from '../entities/cart-location.entity';

@Injectable()
export class CartLocationRepository extends Repository<CartLocation> {
  constructor(private readonly dataSource: DataSource) {
    super(CartLocation, dataSource.createEntityManager());
  }

  getMany(dto: PageRequestDto): Promise<CartLocation[]> {
    let qb = this.createQueryBuilder('cartLocation');
    if (dto.pageSize) {
      qb = qb.take(dto.getLimit()).skip(dto.getOffset());
    }
    return qb.getMany();
  }

  getOne(idx: number): Promise<CartLocation> {
    return this.createQueryBuilder('cartLocation')
      .where('cartLocation.idx = :idx', { idx })
      .getOne();
  }

  async createLocation(dto: CreateCartLocationDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CartLocation)
        .values(dto)
        .execute();
      return identifiers;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateLocation(dto: UpdateCartLocationDto) {
    try {
      const { cartLocationIdx: idx, ...updateDto } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CartLocation)
        .set(updateDto)
        .where('idx = :idx', { idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteLocation(cartLocationIdx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CartLocation)
      .where('idx = :idx', { idx: cartLocationIdx })
      .execute();
    return affected;
  }
}
