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
    let qb = this.dataSource
      .createQueryBuilder()
      .select([
        'name',
        'gender',
        'guide',
        'auth',
        'baptize',
        'driver',
        'cart',
        'profile',
        'status',
        'car',
        'live',
        'pushToken',
        'user.idx AS userIdx',
      ])
      .from(User, 'user')
      .leftJoin(Access, 'access', 'user.idx = access.userIdx');
    if (dto) {
      if (dto.name) {
        qb = qb.where('user.name REGEXP :name', { name: dto.name });
      }
      if (dto.orderBy) {
        qb = qb.orderBy('access.live', 'DESC').addOrderBy(`user.${dto.orderBy}`, !dto.desc ? 'ASC' : 'DESC');
      }
      if (dto.pageSize) {
        qb = qb.take(dto.getLimit()).skip(dto.getOffset());
      }
    }
    return qb.execute();
  }

  getOne(userDto: GetUserDto): Promise<User> {
    const { userIdx, name } = userDto;
    const where = userIdx ? 'user.idx = :userIdx' : 'user.name = :name';
    const parameters = userIdx ? { userIdx } : { name };
    return this.dataSource
      .createQueryBuilder()
      .select([
        'name',
        'password',
        'gender',
        'guide',
        'auth',
        'baptize',
        'driver',
        'cart',
        'profile',
        'status',
        'car',
        'live',
        'user.idx AS userIdx',
      ])
      .from(User, 'user')
      .leftJoin(Access, 'access', 'user.idx = access.userIdx')
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

  async updateUserProfile(userDto: UpdateUserDto) {
    try {
      const { userIdx, profile } = userDto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({ profile })
        .where('idx = :idx', { idx: userIdx })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }
}
