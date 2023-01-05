import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    res.cookie('r', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
    });
    return res.send({ accessToken });
  }

  @Post('refreshToken')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req,
    );
    res.cookie('r', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
    });
    return res.send({ accessToken });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('access')
  updateAccess(@Req() req: Request, @Body() dto: UpdateAccessDto) {
    return this.authService.updateAccess(dto, req.user);
  }
}
