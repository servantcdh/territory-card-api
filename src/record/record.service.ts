import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrewAssignedRepository } from 'src/assign/repositories/crew-assigned.repository';
import { UpdateCardContentDto } from 'src/card/dto/update-card-content.dto';
import { CardContentRepository } from 'src/card/repositories/card-content.repository';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreateCardRecordDto } from './dto/create-card-record.dto';
import { CardMarkRepository } from './repositories/card-mark.repository';
import { CardRecordRepository } from './repositories/card-record.repository';
import { TerritoryRecordRepository } from './repositories/territory-record.repository';

@Injectable()
export class RecordService {
  constructor(
    private readonly cardRecordRepository: CardRecordRepository,
    private readonly crewAssignedRepository: CrewAssignedRepository,
    private readonly territoryRecordRepository: TerritoryRecordRepository,
    private readonly cardMarkRepository: CardMarkRepository,
    private readonly cardContentRepository: CardContentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async recordCard(dto: CreateCardRecordDto, userIdx: number) {
    const crewAssigned = await this.crewAssignedRepository.getAssignedCrew(
      dto.cardAssignedIdx,
    );
    const crew = crewAssigned.find((crew) => crew.userIdx === userIdx);
    if (!crew) {
      throw new ForbiddenException('배정된 전도인이 아님');
    }
    const { idx } = crew;
    dto.crewAssignedIdx = idx;
    const affected = await this.cardRecordRepository.updateCardRecord(dto);
    if (!affected) {
      return this.cardRecordRepository.createCardRecord(dto);
    }
    const { idx: refusalMarkIdx } = await this.cardMarkRepository.getOneByMarkName('방문거절');
    if (dto.cardMarkIdx === refusalMarkIdx) {
      const updateCardContentDto: UpdateCardContentDto = {
        cardContentIdx: dto.cardContentIdx,
        refusal: true
      };
      this.cardContentRepository.updateCardContent(updateCardContentDto);
    }
    return affected;
  }

  async getTerritoryRecord(serviceYear: number, userIdx: number) {
    const getUserDto = new GetUserDto();
    getUserDto.userIdx = userIdx;
    const user = await this.userRepository.getOne(getUserDto);
    if (!(user.auth || user.guide)) {
      throw new ForbiddenException(
        '다음의 권한 중 하나를 가진 사용자여야함: 관리자, 인도자',
      );
    }
    return this.territoryRecordRepository.getMany(serviceYear);
  }
}
