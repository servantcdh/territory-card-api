import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';
import { Access } from '../entities/access.entity';

@Injectable()
export class AuthRepository extends Repository<Access> {
  constructor(private readonly dataSource: DataSource) {
    super(Access, dataSource.createEntityManager());
  }

  getOne(userIdx: number): Promise<Access> {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(Access, 'a')
      .where('a.userIdx = :userIdx', { userIdx })
      .getRawOne();
  }

  async createAccess(accessDto: CreateAccessDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Access)
        .values([accessDto])
        .execute();
      const { idx } = identifiers[0];
      return idx;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateAccess(accessDto: UpdateAccessDto) {
    try {
      const { user, ...dto } = accessDto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(Access)
        .set(dto)
        .where('userIdx = :userIdx', { userIdx: user.idx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
