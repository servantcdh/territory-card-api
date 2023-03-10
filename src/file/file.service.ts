import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CardAssignedRepository } from 'src/assign/repositories/card-assigned.repository';
import { CardTag } from 'src/card/entities/card-tag.entity';
import { CardBackupRepository } from 'src/card/repositories/card-backup.repository';
import { CardContentBackupRepository } from 'src/card/repositories/card-content-backup.repository';
import { CardContentRepository } from 'src/card/repositories/card-content.repository';
import { CardTagRepository } from 'src/card/repositories/card-tag.repository';
import { CardRepository } from 'src/card/repositories/card.repository';
import { TerritoryRecordRepository } from 'src/record/repositories/territory-record.repository';
import { GetCardDto } from 'src/card/dto/get-card.dto';
import { getCardForm } from './forms/get-card-form';
import { readCardForm } from './forms/read-card-form';
import { getS13 } from './forms/get-s13-form';
import { checkDto } from './validators/check-validation';
import { deleteFile } from './multerS3.option';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly cardContentRepository: CardContentRepository,
    private readonly cardTagRepository: CardTagRepository,
    private readonly cardAssignedRepository: CardAssignedRepository,
    private readonly cardBackupRepository: CardBackupRepository,
    private readonly cardContentBackupRepository: CardContentBackupRepository,
    private readonly territoryRecordRepository: TerritoryRecordRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
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
    // 1. Card ??????
    const card = await this.cardRepository.getOne(cardIdx);
    if (!card) {
      const statusCode = HttpStatus.NOT_FOUND;
      const message = `?????? ?????? ??????: ${cardIdx}`;
      return res.status(statusCode).json({ statusCode, message });
    }
    // 2. CardContent ??????
    const cardContent = await this.cardContentRepository.getMany(card.idx);
    // 3. Excel ?????? ??? ??????
    getCardForm(res, [card, cardContent]);
  }

  async createCards(files: Array<Express.Multer.File>) {
    for (const file of files) {
      await this.parseAndCreateCard(file);
    }
  }

  async parseAndCreateCard(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('?????? ????????? ??????????????? ??????');
    }

    let { cardIdx, createCard, updateCard, createCardTag, createCardContent } =
      await readCardForm(file);

    // ????????? ??????
    checkDto(createCard, ['name']);
    checkDto(createCardContent, ['street', 'building', 'name']);

    if (!cardIdx) {
      // 1. ?????? ?????? ?????? > card entity ??????
      cardIdx = await this.cardRepository.createCard(createCard);
      createCardContent = createCardContent.map((dto) => ({ ...dto, cardIdx }));
    } else {
      // 1. CardAssigned ?????? >> ?????? ??? ????????? ????????? ?????? ?????? ??????
      const cardAssigned = await this.cardAssignedRepository.getOneNotComplete(
        cardIdx,
      );
      if (cardAssigned) {
        throw new BadRequestException(
          `???????????? ????????? ?????? ??????: cardIdx ${cardIdx}`,
        );
      }
      // 2. ?????? CardContent ????????? ?????? ???????????? ?????? ??? ??????
      const cachingCardContent = await this.cardContentRepository.getMany(
        cardIdx,
      );
      if (!cachingCardContent.length) {
        throw new BadRequestException(
          `?????? ????????? ??????????????? ?????? ???????????? ???`,
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
          `CardContent ?????? ??????: cardIdx ${cardIdx}`,
        );
      }
      this.cardContentRepository.deleteCardContent(cardIdx);
      // 3. ?????? Card ????????? ?????? ???????????? ??????
      await this.cardBackupRepository.deleteCardBackup(cardIdx);
      const cachingCard = await this.cardRepository.getOne(cardIdx);
      const cardBackup = { ...cachingCard, cardIdx: cachingCard.idx };
      const applied_c = await this.cardBackupRepository.createCardBackup(
        cardBackup,
      );
      if (!applied_c.length) {
        throw new BadRequestException(`Card ?????? ??????: cardIdx ${cardIdx}`);
      }
      // 4. ????????? ???????????? ????????????
      await this.cardRepository.updateCard(updateCard);
    }
    // ?????? ?????? ??????
    this.cardContentRepository.createCardContent(createCardContent);
    // ?????? ?????? ???????????? ??????
    const cardTag: CardTag[] = await this.cardTagRepository.getMany();
    for (const data of cardTag) {
      const getCardDto = new GetCardDto();
      getCardDto.tags = data.tag.replace('#', '');
      const cards = await this.cardRepository.getMany(getCardDto);
      if (!cards || !cards.length) {
        // ?????? ????????? ?????? ????????? ?????? ??????
        await this.cardTagRepository.deleteCardTag(data.tag);
      } else {
        // ?????? ????????? ?????? ????????? ?????? ?????? ??????
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

    // ?????? ??????
    this.cardTagRepository.createCardTag(createCardTag);

    return cardIdx;
  }

  async getTerritoryRecord(serviceYear: number) {
    const territoryRecord = await this.territoryRecordRepository.getMany(
      serviceYear,
    );
    if (!territoryRecord.length) {
      throw new NotFoundException('?????? ?????? ?????? ?????? ?????? ????????? ??????');
    }
    return getS13(territoryRecord);
  }

  uploadProfile(file: Express.MulterS3.File, userIdx: number) {
    if (!file) {
      throw new BadRequestException('????????? ????????? ??????????????? ??????');
    }
    const filePath = `${this.configService.get('AWS_DEPLOY_DOMAIN_NAME')}/${
      file.key
    }`;

    const dto = new UpdateUserDto();
    dto.userIdx = userIdx;
    dto.profile = filePath;
    this.userRepository.updateUserProfile(dto);

    return { filePath };
  }

  deleteProfile(fileName: string, userIdx: number) {
    const key = `data/${fileName}`;

    const dto = new UpdateUserDto();
    dto.userIdx = userIdx;
    dto.profile = null;
    this.userRepository.updateUserProfile(dto);

    return deleteFile(this.configService, key);
  }
}
