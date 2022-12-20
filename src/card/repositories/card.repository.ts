import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Card } from "../entities/card.entity";

@Injectable()
export class CardRepository {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>
    ) {}
}