import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateAssignedCrewDto } from '../dto/create-assigned-crew.dto';
import { CrewAssigned } from '../entities/crew-assigned.entity';

@Injectable()
export class CrewAssignedRepository extends Repository<CrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CrewAssigned, dataSource.createEntityManager());
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
      const message = e.sqlMessage as string;
      if (message.includes('Duplicate')) {
        console.log(message);
      }
    }
  }

  // deleteAssignedCrew() {
  //   return this.dataSource
  //     .createQueryBuilder()
  //     .delete()
  //     .from(CardTag)
  //     .where('tag = :tag', { tag })
  //     .execute();
  // }
}
