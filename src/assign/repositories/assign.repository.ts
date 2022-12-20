import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CardAssigned } from "../entities/card-assigned.entity";
import { CrewAssigned } from "../entities/crew-assigned.entity";

@Injectable()
export class AssignRepository {
    constructor(
        @InjectRepository(CardAssigned)
        private readonly cardAssignedRepository: Repository<CardAssigned>,
        @InjectRepository(CrewAssigned)
        private readonly crewAssignedRepository: Repository<CrewAssigned>,
    ) {}
}