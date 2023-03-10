import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTerritoryRecordContentDto } from 'src/record/dto/create-territory-record-content.dto';
import { CreateTerritoryRecordDto } from 'src/record/dto/create-territory-record.dto';
import { GetCardRecordDto } from 'src/record/dto/get-card-record.dto';
import { UpdateTerritoryRecordDto } from 'src/record/dto/update-territory-record.dto';
import { CardRecordRepository } from 'src/record/repositories/card-record.repository';
import { TerritoryRecordContentRepository } from 'src/record/repositories/territory-record-content.repository';
import { TerritoryRecordRepository } from 'src/record/repositories/territory-record.repository';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { FirebaseService } from 'src/shared/services/firebase/firebase.service';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreateAssignedCardDto } from './dto/create-assigned-card.dto';
import { CreateAssignedCrewDto } from './dto/create-assigned-crew.dto';
import { GetAssignedCardDto } from './dto/get-assigned-card.dto';
import { UpdateAssignedCardDto } from './dto/update-assigned-card.dto';
import { CardAssignedRepository } from './repositories/card-assigned.repository';
import { CrewAssignedRepository } from './repositories/crew-assigned.repository';

@Injectable()
export class AssignService {
  constructor(
    private readonly cardAssignedRepository: CardAssignedRepository,
    private readonly crewAssignedRepository: CrewAssignedRepository,
    private readonly cardRecordRepository: CardRecordRepository,
    private readonly territoryRecordRepository: TerritoryRecordRepository,
    private readonly territoryRecordContentRepository: TerritoryRecordContentRepository,
    private readonly userRepository: UserRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  getOne(assignedCardIdx: number) {
    return this.cardAssignedRepository.getOne(assignedCardIdx);
  }

  getMany(dto: PageRequestDto) {
    return this.cardAssignedRepository.getMany(dto);
  }

  getManyToMe(dto: GetAssignedCardDto) {
    return this.cardAssignedRepository.getManyToMe(dto);
  }

  async assignCard(dto: CreateAssignedCardDto) {
    const map = dto.cardIdxes.map((cardIdx) => ({ cardIdx }));
    const createDto = [];
    for (const dto of map) {
      const assignedCard = await this.cardAssignedRepository.getOneNotComplete(
        dto.cardIdx,
      );
      if (!assignedCard) {
        createDto.push(dto);
      }
    }
    return this.cardAssignedRepository.createAssignedCard(createDto);
  }

  async updateUserIdxAssignedCard(dto: UpdateAssignedCardDto) {
    const assignedCard = await this.cardAssignedRepository.getOne(
      dto.cardAssignedIdx,
    );
    if (!assignedCard) {
      throw new NotFoundException('?????? ??????');
    }
    if (assignedCard.dateCompleted) {
      throw new BadRequestException('????????? ????????? ?????? ??????');
    }
    if (dto.userIdx) {
      const crewAssignedUserIdx = assignedCard.crewAssigned.map(
        (c) => c.userIdx,
      );
      if (!crewAssignedUserIdx.includes(dto.userIdx)) {
        throw new BadRequestException('????????? ?????????????????? ???');
      }
    }
    return this.cardAssignedRepository.updateAssignedCard(dto);
  }

  async completeAssignedCard(dto: UpdateAssignedCardDto) {
    const { cardAssignedIdx, userIdx } = dto;
    const assignedCard = await this.cardAssignedRepository.getOne(
      cardAssignedIdx,
    );
    if (!assignedCard) {
      throw new BadRequestException('?????? ??????');
    }
    const { dateAssigned, cardIdx } = assignedCard;
    let { userIdx: userIdxAssignedTo, dateCompleted } = assignedCard;
    if (dateCompleted) {
      throw new BadRequestException('?????? ????????? ??????');
    }
    if (userIdxAssignedTo !== userIdx) {
      const getUserDto = new GetUserDto();
      getUserDto.userIdx = userIdx;
      const user = await this.userRepository.getOne(getUserDto);
      if (!user.auth && !user.guide) {
        throw new ForbiddenException(
          '????????? ?????? ??? ????????? ?????? ??????????????????: ?????????, ?????????, ???????????????',
        );
      } else {
        /**
         * ????????? ?????? ???????????? ????????? ????????? ???
         * ?????? ?????? ?????? ??? ????????? ????????? ?????? ?????? ?????? ??? ?????? ?????? ?????? ?????? ????????????
         */
        if ((user.auth || user.guide) && user.idx !== userIdxAssignedTo) {
          const getCardRecordDto: GetCardRecordDto = { cardAssignedIdx };
          const cardRecord = await this.cardRecordRepository.getMany(
            getCardRecordDto,
          );
          if (!cardRecord.length) {
            return this.cardAssignedRepository.deleteAssignedCard(
              cardAssignedIdx,
            );
          } else {
            userIdxAssignedTo = cardRecord[0].crewAssigned.userIdx;
          }
        }
      }
    }
    const offset = 1000 * 60 * 60 * 9;
    const korNow = new Date(new Date().getTime() + offset);
    dto.dateCompleted = korNow;
    const affected = await this.cardAssignedRepository.updateAssignedCard(dto);
    if (affected) {
      const serviceYear = korNow.getFullYear();
      const createTerritoryRecordDto: CreateTerritoryRecordDto = {
        serviceYear,
        cardIdx,
      };
      const territoryRecord = await this.territoryRecordRepository.getOne(
        serviceYear,
        cardIdx,
      );
      let territoryRecordIdx = 0;
      if (!territoryRecord) {
        territoryRecordIdx =
          await this.territoryRecordRepository.createTerritoryRecord(
            createTerritoryRecordDto,
          );
      } else {
        territoryRecordIdx = territoryRecord.idx;
        const updateTerritoryRecordDto: UpdateTerritoryRecordDto = {
          territoryRecordIdx,
          lastDateCompleted: new Date(korNow.getTime() - offset),
          ...createTerritoryRecordDto,
        };
        this.territoryRecordRepository.updateTerritoryRecord(
          updateTerritoryRecordDto,
        );
      }
      const createTerritoryRecordContentDto: CreateTerritoryRecordContentDto = {
        territoryRecordIdx,
        userIdx: userIdxAssignedTo,
        dateAssigned: new Date(dateAssigned.getTime() - offset),
      };
      this.territoryRecordContentRepository.createTerritoryRecordContent(
        createTerritoryRecordContentDto,
      );
    }
    return affected;
  }

  async assignCrew(dto: CreateAssignedCrewDto) {
    const { cardAssignedIdx, userIdxes, pushTokens } = dto;
    const crewsAssigned = await this.crewAssignedRepository.getAssignedCrew(
      cardAssignedIdx,
    );
    const userIdxesCrews = crewsAssigned.map((assigned) => assigned.userIdx);
    const userIdxesForDelete = userIdxesCrews.filter(
      (userIdx) => !userIdxes.includes(userIdx),
    );
    const userIdxesForInsert = userIdxes.filter(
      (userIdx) => !userIdxesCrews.includes(userIdx),
    );
    const deleteDto = userIdxesForDelete.map((userIdx) => ({
      userIdx,
      cardAssignedIdx,
    }));
    const insertDto = userIdxesForInsert.map((userIdx) => ({
      userIdx,
      cardAssignedIdx,
    }));
    const affected = deleteDto.length
      ? await this.crewAssignedRepository.deleteCrew(deleteDto)
      : 0;
    const identifiers = insertDto.length
      ? await this.crewAssignedRepository.assignCrew(insertDto)
      : [];
    if (pushTokens.length) {
      const cardAssigned = await this.getOne(cardAssignedIdx);
      const { card, cardIdx } = cardAssigned;
      const { name: cardName } = card;
      this.firebaseService.sendPush(
        pushTokens,
        `??????????????? ?????????????????????.`,
        `????????????${cardIdx}. ${cardName}`,
      );
    }
    return { affected, identifiers };
  }
}
