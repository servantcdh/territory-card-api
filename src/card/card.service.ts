import { Injectable } from '@nestjs/common';
import { GetCardDto } from './dto/get-card.dto';
import { CardRepository } from './repositories/card.repository';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  getCard(dto: GetCardDto) {
    return this.cardRepository.getMany(dto);
  }
}
