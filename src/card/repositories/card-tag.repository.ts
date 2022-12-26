import { Injectable } from '@nestjs/common';
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

  async createCardTag(cardTagDto: CreateCardTagDto[]) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardTag)
        .values(cardTagDto)
        .execute();
      return identifiers.map((r) => r.idx);
    } catch (e) {
      const message = e.sqlMessage as string;
      if (message.includes('Duplicate')) {
        const duplicatedTag = message
          .split(' ')
          .filter((word) => REGEX_HASHTAG.test(word))
          .map((word) => word.substring(word.indexOf('#')).replace("'", ''))[0];
        const filtered = cardTagDto.filter((dto) => dto.tag !== duplicatedTag);
        return this.createCardTag(filtered);
      }
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
