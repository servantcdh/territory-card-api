import { ForbiddenException, Injectable } from '@nestjs/common';
import { REGEX_HASHTAG } from 'src/file/forms/read-card-form';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateCardTagDto } from '../dto/create-card-tag.dto';
import { CardTag } from '../entities/card-tag.entity';

@Injectable()
export class CardTagRepository extends Repository<CardTag> {
  constructor(private readonly dataSource: DataSource) {
    super(CardTag, dataSource.createEntityManager());
  }

  getMany(dto?: PageRequestDto): Promise<CardTag[]> {
    let qb = this.dataSource.createQueryBuilder().select().from(CardTag, 'ct');
    if (dto) {
      qb = qb.take(dto.getLimit()).skip(dto.getOffset());
    }
    return qb.execute();
  }

  async createCardTag(dto: CreateCardTagDto[]) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardTag)
        .values(dto)
        .execute();
      return identifiers.map((r) => r.idx);
    } catch (e) {
      const message = e.sqlMessage as string;
      if (message.includes('Duplicate')) {
        const duplicatedTag = message
          .split(' ')
          .filter((word) => REGEX_HASHTAG.test(word))
          .map((word) => word.substring(word.indexOf('#')).replace("'", ''))[0];
        const filtered = dto.filter((d) => d.tag !== duplicatedTag);
        const updateDto = dto.find((d) => d.tag === duplicatedTag);
        this.updateCardTag(updateDto);
        return this.createCardTag(filtered);
      }
    }
  }

  async updateCardTag(dto: CreateCardTagDto) {
    try {
      const { tag, count } = dto;
      const { affected } = await this.dataSource
        .createQueryBuilder()
        .update(CardTag)
        .set({ count })
        .where('tag = :tag', { tag })
        .execute();
      return affected;
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  deleteCardTag(tag: string) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CardTag)
      .where('tag = :tag', { tag })
      .execute();
  }
}
