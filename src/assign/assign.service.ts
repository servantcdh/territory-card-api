import { ForbiddenException, Injectable } from '@nestjs/common';
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
    private readonly userRepository: UserRepository,
  ) {}

  getMany(dto: GetAssignedCardDto) {
    return this.cardAssignedRepository.getMany(dto);
  }

  async assignCard(dto: CreateAssignedCardDto) {
    const assignedCard = await this.cardAssignedRepository.getOneNotComplete(
      dto.cardIdx,
    );
    if (assignedCard) {
      throw new ForbiddenException('이미 배정된 카드');
    }
    return this.cardAssignedRepository.createAssignedCard(dto);
  }

  async updateUserIdxAssignedCard(dto: UpdateAssignedCardDto) {
    const assignedCard = await this.cardAssignedRepository.getOne(
      dto.cardAssignedIdx,
    );
    if (!assignedCard) {
      throw new ForbiddenException('없는 카드');
    }
    if (assignedCard.userIdx) {
      throw new ForbiddenException('이미 대표전도인이 배정됨');
    }
    if (assignedCard.dateCompleted) {
      throw new ForbiddenException('완료된 카드는 수정 불가');
    }
    const crewAssignedUserIdx = assignedCard.crewAssigned.map((c) => c.userIdx);
    if (!crewAssignedUserIdx.includes(dto.userIdx)) {
      throw new ForbiddenException('배정된 전도인이어야 함');
    }
    dto.complete = false;
    return this.cardAssignedRepository.updateAssignedCard(dto);
  }

  async completeAssignedCard(dto: UpdateAssignedCardDto) {
    const { cardAssignedIdx, userIdx } = dto;
    const assignedCard = await this.cardAssignedRepository.getOne(
      cardAssignedIdx,
    );
    if (!assignedCard) {
      throw new ForbiddenException('없는 카드');
    }
    const { userIdx: primary, dateCompleted } = assignedCard;
    if (dateCompleted) {
      throw new ForbiddenException('이미 완료된 카드');
    }
    const getUserDto = new GetUserDto();
    getUserDto.idx = userIdx;
    const user = await this.userRepository.getOne(getUserDto);
    if (!user.auth) {
      if (!user.guide) {
        if (primary !== userIdx) {
          throw new ForbiddenException(
            '다음의 권한 중 하나를 가진 사용자여야함: 관리자, 인도자, 대표전도인',
          );
        }
      }
    }
    if ((user.auth || user.guide) && user.idx !== primary) {
        // 관리자 / 인도자 카드 회수
        /**
         * TODO 봉사 기록 조회 후 이력이 없다면 배정 카드 삭제 후 예외 처리
         * if () {
               throw new  
        }
         */
        
    }
    dto.complete = true;
    const affected = await this.cardAssignedRepository.updateAssignedCard(dto);
    if (affected) {
      // TODO 구역배정기록 쌓기
    }
    return affected;
  }

  assignCrew(dto: CreateAssignedCrewDto) {
    return this.crewAssignedRepository.assignCrew(dto);
  }
}
