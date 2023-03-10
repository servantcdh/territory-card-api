import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCardContentDto } from '../dto/create-card-content.dto';
import { UpdateCardContentDto } from '../dto/update-card-content.dto';
import { CardContent } from '../entities/card-content.entity';

@Injectable()
export class CardContentRepository extends Repository<CardContent> {
  constructor(private readonly dataSource: DataSource) {
    super(CardContent, dataSource.createEntityManager());
  }

  getMany(cardIdx: number): Promise<CardContent[]> {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(CardContent, 'cc')
      .where('cc.cardIdx = :cardIdx', { cardIdx })
      .execute();
  }

  async createCardContent(cardContentDto: CreateCardContentDto[]) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CardContent)
        .values(cardContentDto.map((dto) => ({ ...dto, status: true })))
        .execute();
      return identifiers.map((r) => r.idx);
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  updateCardContentRefusal(dto: UpdateCardContentDto) {
    const { cardContentIdx, refusal } = dto;
    return this.dataSource
      .createQueryBuilder()
      .update(CardContent)
      .set({ refusal })
      .where('idx = :cardContentIdx', { cardContentIdx })
      .execute();
  }

  updateCardContent(dto: UpdateCardContentDto) {
    const { cardContentIdx, ...content } = dto;
    return this.dataSource
      .createQueryBuilder()
      .update(CardContent)
      .set(content)
      .where('idx = :cardContentIdx', { cardContentIdx })
      .execute();
  }

  deleteCardContent(cardIdx: number) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CardContent)
      .where('cardIdx = :cardIdx', { cardIdx })
      .execute();
  }
}
