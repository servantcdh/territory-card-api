import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { CardService } from './card.service';
import { GetCardDto } from './dto/get-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

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

  @Patch('one/:cardIdx')
  @UseGuards(AuthGuard('jwt'))
  updateCard(@Param('cardIdx') cardIdx: number, dto: UpdateCardDto) {
    dto.idx = cardIdx;
    return this.cardService.updateCard(dto);
  }

  @Get('tag')
  @UseGuards(AuthGuard('jwt'))
  getTag(@Query() dto: PageRequestDto) {
    return this.cardService.getTag(dto);
  }
}
