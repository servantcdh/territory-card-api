import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserSearchDto } from './dto/get-user-search.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getMany(@Query() dto: GetUserSearchDto) {
    return this.userService.getMany(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('one/:idx')
  getOne(@Param('idx') idx: number) {
    return this.userService.getOne(idx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('one')
  getMe(@Req() req: Request) {
    const { idx } = req.user as any;
    return this.userService.getOne(idx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':idx')
  updateUser(@Param('idx') idx: number, @Body() dto: UpdateUserDto) {
    dto.userIdx = idx;
    return this.userService.updateUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const { idx } = req.user as any;
    dto.userIdx = idx;
    return this.userService.updateUser(dto);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
