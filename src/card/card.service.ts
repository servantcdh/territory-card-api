import { Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { GetCardDto } from './dto/get-card.dto';
import { CardTagRepository } from './repositories/card-tag.repository';
import { CardRepository } from './repositories/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly cardTagRepository: CardTagRepository,
  ) {}

  getCard(dto: GetCardDto) {
    return this.cardRepository.getMany(dto);
  }

  async getOne(cardIdx: number) {
    return this.cardRepository.getOne(cardIdx);
  }

  getTag(dto: PageRequestDto) {
    return this.cardTagRepository.getMany(dto);
  }
}
