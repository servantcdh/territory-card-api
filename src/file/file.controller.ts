import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('form')
  downloadDefaultFormByExcel(@Res() res: Response) {
    this.fileService.getCardForm(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('card/:cardIdx')
  downloadCardByExcel(@Res() res: Response, @Param('cardIdx') cardIdx: number) {
    this.fileService.getCard(res, cardIdx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('card')
  @UseInterceptors(FileInterceptor('excel'))
  uploadCardByExcel(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.parseAndCreateCard(file);
  }

}