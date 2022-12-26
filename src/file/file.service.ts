import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { CardTag } from 'src/card/entities/card-tag.entity';
import { CardBackupRepository } from 'src/card/repositories/card-backup.repository';
import { CardContentBackupRepository } from 'src/card/repositories/card-content-backup.repository';
import { CardContentRepository } from 'src/card/repositories/card-content.repository';
import { CardTagRepository } from 'src/card/repositories/card-tag.repository';
import { CardRepository } from 'src/card/repositories/card.repository';
import { GetCardDto } from 'src/card/dto/get-card.dto';
import { getCardForm } from './forms/get-card-form';
import { readCardForm } from './forms/read-card-form';
import { checkDto } from './validators/check-validation';

@Injectable()
export class FileService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly cardContentRepository: CardContentRepository,
    private readonly cardTagRepository: CardTagRepository,
    private readonly cardAssignedRepository: CardAssignedRepository,
    private readonly cardBackupRepository: CardBackupRepository,
    private readonly cardContentBackupRepository: CardContentBackupRepository,
  ) {}

  getCardForm(res: Response) {
    try {
      getCardForm(res);
    } catch (e) {
      const statusCode = HttpStatus.BAD_REQUEST;
      return res.status(statusCode).json({ statusCode, message: e.message });
    }
  }

  async getCard(res: Response, cardIdx: number) {
    // 1. Card 조회
    const card = await this.cardRepository.getOne(cardIdx);
    if (!card) {
      const statusCode = HttpStatus.NOT_FOUND;
      const message = `없는 구역 번호: ${cardIdx}`;
      return res.status(statusCode).json({ statusCode, message });
    }
    // 2. CardContent 조회
    const cardContent = await this.cardContentRepository.getMany(card.idx);
    // 3. Excel 작성 및 응답
    getCardForm(res, [card, cardContent]);
  }

  async parseAndCreateCard(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('엑셀 파일이 업로드되지 않음');
    }

    let { cardIdx, createCard, updateCard, createCardTag, createCardContent } =
      await readCardForm(file);

    // 유효성 검사
    checkDto(createCard, ['name']);
    checkDto(createCardContent, ['street', 'building', 'name']);

    // 기존 태그 리스트를 조회
    const cardTag: CardTag[] = await this.cardTagRepository.getMany();
    cardTag.forEach(async (data) => {
      const getCardDto = new GetCardDto();
      getCardDto.tags = data.tag.replace('#', '');
      const cards = await this.cardRepository.getMany(getCardDto);
      if (!cards || !cards.length) {
        // 매칭 카드가 없는 태그는 삭제 처리
        this.cardTagRepository.deleteCardTag(data.tag);
      } else {
        // 매칭 카드가 있는 태그는 사용 횟수 증가
        createCardTag.forEach((dto) => {
          if (dto.tag === data.tag) {
            dto.count += cards.length;
          }
        });
      }
    });
    // 해시태그 저장
    await this.cardTagRepository.createCardTag(createCardTag);

    if (!cardIdx) {
      // 1. 신규 카드 생성 > card entity 반환
      cardIdx = await this.cardRepository.createCard(createCard);
      createCardContent = createCardContent.map((dto) => ({ ...dto, cardIdx }));
    } else {
      // 1. CardAssigned 조회 >> 할당 및 미반납 카드일 경우 예외 처리
      const cardAssigned = await this.cardAssignedRepository.getOneNotComplete(cardIdx);
      if (cardAssigned) {
        throw new BadRequestException(
          `사용중인 카드는 수정 불가: cardIdx ${cardIdx}`,
        );
      }
      // 2. 기존 CardContent 내용을 캐싱 테이블로 이관 및 삭제
      const cachingCardContent = await this.cardContentRepository.getMany(
        cardIdx,
        );
        if (!cachingCardContent.length) {
          throw new BadRequestException(
            `엑셀 양식을 재다운로드 받아 작성해야 함`,
          );
        }
      await this.cardContentBackupRepository.deleteCardContentBackup(cardIdx);
      const cardContentBackup = cachingCardContent.map((cc) => ({
        ...cc,
        cardIdx: cc.cardIdx,
        cardContentIdx: cc.idx,
      }));
      const applied_ccb =
        await this.cardContentBackupRepository.createCardContentBackup(
          cardContentBackup,
        );
      if (!applied_ccb.length) {
        throw new BadRequestException(
          `CardContent 캐싱 실패: cardIdx ${cardIdx}`,
        );
      }
      this.cardContentRepository.deleteCardContent(cardIdx);
      // 3. 기존 Card 내용을 캐싱 테이블로 이관
      await this.cardBackupRepository.deleteCardBackup(cardIdx);
      const cachingCard = await this.cardRepository.getOne(cardIdx);
      const cardBackup = { ...cachingCard, cardIdx: cachingCard.idx };
      const applied_c = await this.cardBackupRepository.createCardBackup(
        cardBackup,
      );
      if (!applied_c.length) {
        throw new BadRequestException(`Card 캐싱 실패: cardIdx ${cardIdx}`);
      }
      // 4. 수정된 내용으로 업데이트
      await this.cardRepository.updateCard(updateCard);
    }
    // 카드 내용 생성
    this.cardContentRepository.createCardContent(createCardContent);
    return cardIdx;
  }
}
