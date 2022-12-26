import { ForbiddenException, Injectable } from '@nestjs/common';
import { Access } from 'src/auth/entities/access.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserDto } from '../dto/get-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getMany(dto: GetUserDto): Promise<User[]> {
    let qb = this.dataSource.createQueryBuilder()
    .select()
    .from(User, 'u')
    .leftJoin(Access, 'a', 'u.idx = a.userIdx')
    if (dto) {
      if (dto.name) {
        qb = qb.where('u.name REGEXP :name', { name: dto.name });
      }
      if (dto.orderBy) {
        qb = qb.orderBy(`ct.${dto.orderBy}`, !dto.desc ? 'ASC' : 'DESC');
      }
      if (dto.pageSize) {
        qb = qb.take(dto.getLimit()).skip(dto.getOffset());
      }
    }
    return qb.execute();
  }

  getOne(userDto: GetUserDto): Promise<User> {
    const { idx, name } = userDto;
    const where = idx ? 'u.idx = :idx' : 'u.name = :name';
    const parameters = idx ? { idx } : { name };
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(User, 'u')
      .where(where, parameters)
      .getRawOne();
  }

  async createUser(userDto: CreateUserDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([userDto])
        .execute();
      const { idx } = identifiers[0];
      return idx;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async updateUser(userDto: UpdateUserDto) {
    try {
      const { userIdx, ...dto } = userDto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set(dto)
        .where('idx = :idx', { idx: userIdx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
