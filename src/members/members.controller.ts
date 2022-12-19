import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Get()
  getOne() {
    return ``;
  }

  @Post()
  setOne(@Body() memberData) {}
}
