import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { FileService } from './file.service';
import { multerOptionFactory } from './multer.option';

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
  @UseInterceptors(FilesInterceptor('excel', undefined, multerOptionFactory()))
  uploadCardByExcel(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.fileService.createCards(files);
  }

  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @Header('Content-Disposition', 'attachment; filename=s-13.docx')
  @UseGuards(AuthGuard('jwt'))
  @Get('s-13/:serviceYear')
  downloadS13ByExcel(@Param('serviceYear') serviceYear: number) {
    return this.fileService.getTerritoryRecord(serviceYear);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  @UseInterceptors(FileInterceptor('profile'))
  uploadProfile(@UploadedFile() file: Express.MulterS3.File, @Req() req: Request) {
    const { userIdx } = req.user as any;
    return this.fileService.uploadProfile(file, userIdx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('profile/:fileName')
  deleteProfile(@Param('fileName') fileName: string, @Req() req: Request) {
    const { userIdx } = req.user as any;
    return this.fileService.deleteProfile(fileName, userIdx);
  }
}
