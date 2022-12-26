import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
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

  @Get('one/:cardIdx')
  @UseGuards(AuthGuard('jwt'))
  getOne(@Param('cardIdx') cardIdx: number) {
    return this.cardService.getOne(cardIdx);
  }

  @Get('tag')
  @UseGuards(AuthGuard('jwt'))
  getTag(@Query() dto: PageRequestDto) {
    return this.cardService.getTag(dto);
  }
}
