import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateAssignedCrewDto } from '../dto/create-assigned-crew.dto';
import { CrewAssigned } from '../entities/crew-assigned.entity';

@Injectable()
export class CrewAssignedRepository extends Repository<CrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CrewAssigned, dataSource.createEntityManager());
  }

  getAssignedCrew(idx: number) {
    return this.dataSource
      .createQueryBuilder()
      .select()
      .from(CrewAssigned, 'ca')
      .where('ca.cardAssignedIdx = :idx', { idx })
      .getRawOne();
  }

  async assignCrew(dto: CreateAssignedCrewDto) {
    try {
      const { identifiers } = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(CrewAssigned)
        .values(dto)
        .execute();
      return identifiers.map((r) => r.idx);
    } catch (e) {
      throw new ForbiddenException(e.sqlMessage);
    }
  }

  async deleteAssignedCrew(idx: number) {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CrewAssigned)
      .where('cardAssignedIdx = :idx', { idx })
      .execute();
    return affected;
  }
}
