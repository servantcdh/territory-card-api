import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardService } from './card.service';
import { GetCardDto } from './dto/get-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getCard(@Query() dto: GetCardDto) {
    return this.cardService.getCard(dto);
  }
}
