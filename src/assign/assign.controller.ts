import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AssignService } from './assign.service';
import { CreateAssignedCardDto } from './dto/create-assigned-card.dto';
import { CreateAssignedCrewDto } from './dto/create-assigned-crew.dto';
import { GetAssignedCardDto } from './dto/get-assigned-card.dto';
import { UpdateAssignedCardDto } from './dto/update-assigned-card.dto';

@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @Get('card')
  @UseGuards(AuthGuard('jwt'))
  getAssignedCard(@Query() dto: GetAssignedCardDto) {
    return this.assignService.getMany(dto);
  }

  @Post('card')
  @UseGuards(AuthGuard('jwt'))
  assignCard(@Body() dto: CreateAssignedCardDto) {
    return this.assignService.assignCard(dto);
  }

  @Patch('card/:idx')
  @UseGuards(AuthGuard('jwt'))
  updateUserIdxAssignedCard(
    @Param('idx') cardAssignedIdx: number,
    @Body() dto: UpdateAssignedCardDto,
  ) {
    dto.cardAssignedIdx = cardAssignedIdx;
    return this.assignService.updateUserIdxAssignedCard(dto);
  }

  @Patch('card/me/:idx')
  @UseGuards(AuthGuard('jwt'))
  completeAssignedCard(
    @Req() req: Request,
    @Param('idx') cardAssignedIdx: number
  ) {
    const { idx: userIdx } = req.user as any;
    const dto: UpdateAssignedCardDto = { userIdx, cardAssignedIdx };
    return this.assignService.completeAssignedCard(dto);
  }

  @Get('card/me')
  @UseGuards(AuthGuard('jwt'))
  getAssignedCardToMe(@Req() req: Request, @Query() dto: GetAssignedCardDto) {
    const { idx } = req.user as any;
    dto.userIdx = idx;
    return this.assignService.getMany(dto);
  }

  @Post('crew')
  @UseGuards(AuthGuard('jwt'))
  assignCrew(@Body() dto: CreateAssignedCrewDto) {
    return this.assignService.assignCrew(dto);
  }
}
