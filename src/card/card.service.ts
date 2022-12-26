import { Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { GetCardDto } from './dto/get-card.dto';
import { CardContentRepository } from './repositories/card-content.repository';
import { CardTagRepository } from './repositories/card-tag.repository';
import { CardRepository } from './repositories/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly cardContentRepository: CardContentRepository,
    private readonly cardTagRepository: CardTagRepository,
  ) {}

  getCard(dto: GetCardDto) {
    return this.cardRepository.getMany(dto);
  }

  async getOne(cardIdx: number) {
    const card = await this.cardRepository.getOne(cardIdx);
    const cardContent = await this.cardContentRepository.getMany(cardIdx);
    return {
      ...card,
      cardContent,
    };
  }

  getTag(dto: PageRequestDto) {
    return this.cardTagRepository.getMany(dto);
  }
}
