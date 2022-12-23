import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CrewAssigned } from '../entities/crew-assigned.entity';

@Injectable()
export class CrewAssignedRepository extends Repository<CrewAssigned> {
  constructor(private readonly dataSource: DataSource) {
    super(CrewAssigned, dataSource.createEntityManager());
  }
}
