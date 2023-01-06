import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateCardRecordParamsDto } from './dto/create-card-record-params.dto';
import { CreateCardRecordDto } from './dto/create-card-record.dto';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post(':cardAssignedIdx/:cardContentIdx')
  @UseGuards(AuthGuard('jwt'))
  recordCard(
    @Req() req: Request,
    @Param() params: CreateCardRecordParamsDto,
    @Body() dto: CreateCardRecordDto,
  ) {
    const { userIdx } = req.user as any;
    dto = { ...dto, ...params };
    return this.recordService.recordCard(dto, userIdx);
  }

  @Get('s-13/:serviceYear')
  @UseGuards(AuthGuard('jwt'))
  getTerritoryRecord(
    @Req() req: Request,
    @Param('serviceYear') serviceYear: number,
  ) {
    const { userIdx } = req.user as any;
    return this.recordService.getTerritoryRecord(serviceYear, userIdx);
  }
}
