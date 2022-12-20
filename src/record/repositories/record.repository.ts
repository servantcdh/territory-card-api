import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CardRecord } from "../entities/card-record.entity";

@Injectable()
export class RecordRepository {
    constructor(
        @InjectRepository(CardRecord)
        private readonly cardRecordRepository: Repository<CardRecord>
    ) {}
}