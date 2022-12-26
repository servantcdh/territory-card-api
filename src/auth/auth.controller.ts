import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('refreshToken')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('access')
  updateAccess(@Req() req: Request, @Body() dto: UpdateAccessDto) {
    return this.authService.updateAccess(dto, req.user);
  }

}
