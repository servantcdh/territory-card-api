import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Access } from "../entities/access.entity";

@Injectable()
export class authRepository {
    constructor(
        @InjectRepository(Access)
        private readonly accessRepository: Repository<Access>
    ) {}
}