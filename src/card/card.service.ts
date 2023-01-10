import { BadRequestException, Injectable } from '@nestjs/common';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { REGEX_HASHTAG } from 'src/file/forms/read-card-form';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { CreateCardContentDto } from './dto/create-card-content.dto';
import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { GetCardDto } from './dto/get-card.dto';
import { RollbackCardDto } from './dto/rollback-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardTag } from './entities/card-tag.entity';
import { CardBackupRepository } from './repositories/card-backup.repository';
import { CardContentBackupRepository } from './repositories/card-content-backup.repository';
import { CardContentRepository } from './repositories/card-content.repository';
import { CardTagRepository } from './repositories/card-tag.repository';
import { CardRepository } from './repositories/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly cardContentRepository: CardContentRepository,
    private readonly cardTagRepository: CardTagRepository,
    private readonly cardBackupRepository: CardBackupRepository,
    private readonly cardContentBackupRepository: CardContentBackupRepository,
    private readonly cardAssignedRepository: CardAssignedRepository,
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

  async rollbackCard(dto: RollbackCardDto) {
    // 1. 사용중인 카드 여부 체크
    const cardAssigned = await this.cardAssignedRepository.getOneNotComplete(
      dto.cardIdx,
    );
    if (cardAssigned) {
      throw new BadRequestException(
        `사용중인 카드는 수정 불가: cardIdx ${dto.cardIdx}`,
      );
    }
    // 2. 카드 캐싱 가져오기
    const cardBackup = await this.cardBackupRepository.getOne(
      dto.cardBackupIdx,
    );
    if (!cardBackup) {
      throw new BadRequestException(
        `백업 데이터가 없음: cardIdx ${dto.cardIdx}`,
      );
    }
    const { name, memo } = cardBackup;
    const updateCardDto: UpdateCardDto = {
      idx: dto.cardIdx,
      name,
      memo,
      status: true,
    };
    // 3. 캐싱 카드로 복원
    await this.updateCard(updateCardDto);
    // 4. 카드 내용 캐싱 가져오기
    const cardContentBackup = await this.cardContentBackupRepository.getMany(
      dto.cardIdx,
    );
    const createCardContentDto: CreateCardContentDto[] = cardContentBackup.map(
      (backup) => {
        const { idx, cardContentIdx, ...content } = backup;
        return content;
      },
    );
    // 5. 카드 내용 삭제
    await this.cardContentRepository.deleteCardContent(dto.cardIdx);
    // 6. 캐싱 데이터로 내용 복원
    await this.cardContentRepository.createCardContent(createCardContentDto);
    // 7. 캐싱 내용 삭제
    await this.cardBackupRepository.deleteCardBackup(dto.cardIdx);
    await this.cardContentBackupRepository.deleteCardContentBackup(dto.cardIdx);
    return true;
  }

  getTag(dto: PageRequestDto) {
    return this.cardTagRepository.getMany(dto);
  }
}
