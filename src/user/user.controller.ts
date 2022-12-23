import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':idx')
  getUser(@Param('idx') idx: number) {
    return this.userService.getUser(idx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getMe(@Req() req: Request) {
    const { idx } = req.user as any;
    return this.userService.getUser(idx);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
