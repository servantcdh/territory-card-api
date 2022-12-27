import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrewAssignedRepository } from 'src/assign/repositories/crew-assigned.repository';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreateCardRecordDto } from './dto/create-card-record.dto';
import { CardRecordRepository } from './repositories/card-record.repository';
import { TerritoryRecordRepository } from './repositories/territory-record.repository';

@Injectable()
export class RecordService {
  constructor(
    private readonly cardRecordRepository: CardRecordRepository,
    private readonly crewAssignedRepository: CrewAssignedRepository,
    private readonly territoryRecordRepository: TerritoryRecordRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async recordCard(dto: CreateCardRecordDto, userIdx: number) {
    const crewAssigned = await this.crewAssignedRepository.getAssignedCrew(
      dto.cardAssignedIdx,
    );
    const isNotCrew =
      crewAssigned.findIndex((crew) => crew.userIdx === userIdx) === -1;
    if (isNotCrew) {
      throw new ForbiddenException('배정된 전도인이 아님');
    }
    const affected = await this.cardRecordRepository.updateCardRecord(dto);
    if (!affected) {
      return this.cardRecordRepository.createCardRecord(dto);
    }
    return affected;
  }

  async getTerritoryRecord(serviceYear: number, userIdx: number) {
    const getUserDto = new GetUserDto();
    getUserDto.idx = userIdx;
    const user = await this.userRepository.getOne(getUserDto);
    if (!(user.auth || user.guide)) {
      throw new ForbiddenException(
        '다음의 권한 중 하나를 가진 사용자여야함: 관리자, 인도자',
      );
    }
    return this.territoryRecordRepository.getMany(serviceYear);
  }
}
