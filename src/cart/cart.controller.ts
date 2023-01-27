import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { CartService } from './cart.service';
import { CreateCartCrewAssignedDto } from './dto/create-cart-crew-assigned.dto';
import { CreateCartDayTimeLocationDto } from './dto/create-cart-day-time-location.dto';
import { CreateCartDayTimeUserDto } from './dto/create-cart-day-time-user.dto';
import { CreateCartDayTimeDto } from './dto/create-cart-day-time.dto';
import { CreateCartLocationDto } from './dto/create-cart-location.dto';
import { UpdateCartDayTimeDto } from './dto/update-cart-day-time.dto';
import { UpdateCartLocationDto } from './dto/update-cart-location.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getWeek(@Query() dto: PageRequestDto) {
    return this.cartService.getWeek(dto);
  }

  @Get('plan/:cartDayTimeIdx')
  @UseGuards(AuthGuard('jwt'))
  getTimePlan(@Param('cartDayTimeIdx') cartDayTimeIdx: number) {
    return this.cartService.getTimePlan(cartDayTimeIdx);
  }

  @Post('plan')
  @UseGuards(AuthGuard('jwt'))
  createTimePlan(@Body() dto: CreateCartDayTimeDto) {
    return this.cartService.createTimePlan(dto);
  }

  @Patch('plan')
  @UseGuards(AuthGuard('jwt'))
  updateTimePlan(@Body() dto: UpdateCartDayTimeDto) {
    return this.cartService.updateTimePlan(dto);
  }

  @Delete('plan/:cartDayTimeIdx')
  @UseGuards(AuthGuard('jwt'))
  deleteTimePlan(@Param('cartDayTimeIdx') cartDayTimeIdx: number) {
    return this.cartService.deleteTimePlan(cartDayTimeIdx);
  }

  @Get('location')
  @UseGuards(AuthGuard('jwt'))
  getLocation(@Query() dto: PageRequestDto) {
    return this.cartService.getLocation(dto);
  }

  @Get('location/:cartLocationIdx')
  @UseGuards(AuthGuard('jwt'))
  getLocationOne(@Param('cartLocationIdx') cartLocationIdx: number) {
    return this.cartService.getLocationOne(cartLocationIdx);
  }

  @Post('location')
  @UseGuards(AuthGuard('jwt'))
  createLocation(@Body() dto: CreateCartLocationDto) {
    return this.cartService.createLocation(dto);
  }

  @Patch('location')
  @UseGuards(AuthGuard('jwt'))
  updateLocation(@Body() dto: UpdateCartLocationDto) {
    return this.cartService.updateLocation(dto);
  }

  @Delete('location/:cartLocationIdx')
  @UseGuards(AuthGuard('jwt'))
  deleteLocation(@Param('cartLocationIdx') cartLocationIdx: number) {
    return this.cartService.deleteLocation(cartLocationIdx);
  }

  @Post('plan/location')
  @UseGuards(AuthGuard('jwt'))
  createTimeLocation(@Body() dto: CreateCartDayTimeLocationDto) {
    return this.cartService.createTimeLocation(dto);
  }

  @Delete('plan/location/:cartDayTimeLocationIdx')
  @UseGuards(AuthGuard('jwt'))
  deleteTimeLocation(
    @Param('cartDayTimeLocationIdx') cartDayTimeLocationIdx: number,
  ) {
    return this.cartService.deleteTimeLocation(cartDayTimeLocationIdx);
  }

  @Post('plan/user')
  @UseGuards(AuthGuard('jwt'))
  createTimeUser(@Body() dto: CreateCartDayTimeUserDto) {
    return this.cartService.createTimeUser(dto);
  }

  @Delete('plan/user/:cartDayTimeUserIdx')
  @UseGuards(AuthGuard('jwt'))
  deleteTimeUser(
    @Param('cartDayTimeUserIdx') cartDayTimeUserIdx: number,
  ) {
    return this.cartService.deleteTimeUser(cartDayTimeUserIdx);
  }

  @Post('plan/assign')
  @UseGuards(AuthGuard('jwt'))
  createCrew(@Body() dto: CreateCartCrewAssignedDto) {
    return this.cartService.createCrew(dto);
  }

  @Delete('plan/assign/:cartCrewAssignedIdx')
  @UseGuards(AuthGuard('jwt'))
  deleteCrew(
    @Param('cartCrewAssignedIdx') cartCrewAssignedIdx: number,
  ) {
    return this.cartService.deleteCrew(cartCrewAssignedIdx);
  }
}
