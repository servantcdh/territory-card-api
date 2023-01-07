import { Injectable } from '@nestjs/common';
import { REGEX_HASHTAG } from 'src/file/forms/read-card-form';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { GetCardDto } from './dto/get-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardTag } from './entities/card-tag.entity';
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

  async updateCard(dto: UpdateCardDto) {
    const tags = dto.memo
      .split(' ')
      .filter((word) => REGEX_HASHTAG.test(word))
      .map((word) => word.substring(word.indexOf('#')));
    const createCardTag: CreateCardTagDto[] = tags.map((tag) => ({
      tag,
      count: 0,
    }));

    const cardTag: CardTag[] = await this.cardTagRepository.getMany();
    for (const data of cardTag) {
      const getCardDto = new GetCardDto();
      getCardDto.tags = data.tag.replace('#', '');
      const cards = await this.cardRepository.getMany(getCardDto);
      if (!cards || !cards.length) {
        // 매칭 카드가 없는 태그는 삭제 처리
        await this.cardTagRepository.deleteCardTag(data.tag);
      } else {
        // 매칭 카드가 있는 태그는 사용 횟수 증가
        for (const dto of createCardTag) {
          if (dto.tag === data.tag) {
            dto.count += cards.length;
          }
        }
      }
    }

    for (const dto of createCardTag) {
      if (!dto.count) {
        dto.count++;
      }
    }

    await this.cardTagRepository.createCardTag(createCardTag);

    return this.cardRepository.updateCard(dto);
  }

  getTag(dto: PageRequestDto) {
    return this.cardTagRepository.getMany(dto);
  }
}
