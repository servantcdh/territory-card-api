import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('downloadForm')
  downloadDefaultFormByExcel(@Res() res: Response) {
    this.fileService.getCardForm(res);
  }

  @Get('downloadCard/:cardIdx')
  downloadCardByExcel(@Res() res: Response, @Param('cardIdx') cardIdx: number) {
    this.fileService.getCard(res, cardIdx);
  }

  @Post('uploadCard')
  @UseInterceptors(FileInterceptor('excel'))
  async uploadCardByExcel(@UploadedFile() file: Express.Multer.File) {
    const cardIdx = await this.fileService.parseAndCreateCard(file);
    return cardIdx;
  }

}
