import { Injectable } from '@nestjs/common';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';
import { FirebaseService } from 'src/shared/services/firebase/firebase.service';
import { CreateCartCrewAssignedDto } from './dto/create-cart-crew-assigned.dto';
import { CreateCartDayTimeLocationDto } from './dto/create-cart-day-time-location.dto';
import { CreateCartDayTimeUserDto } from './dto/create-cart-day-time-user.dto';
import { CreateCartDayTimeDto } from './dto/create-cart-day-time.dto';
import { CreateCartLocationDto } from './dto/create-cart-location.dto';
import { UpdateCartDayTimeDto } from './dto/update-cart-day-time.dto';
import { UpdateCartLocationDto } from './dto/update-cart-location.dto';
import { CartCrewAssignedRepository } from './repositories/cart-crew-assigned.repository';
import { CartDayTimeLocationRepository } from './repositories/cart-day-time-location.repository';
import { CartDayTimeUserRepository } from './repositories/cart-day-time-user.repository';
import { CartDayTimeRepository } from './repositories/cart-day-time.repository';
import { CartDayRepository } from './repositories/cart-day.repository';
import { CartLocationRepository } from './repositories/cart-location.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartDayRepository: CartDayRepository,
    private readonly cartDayTimeRepository: CartDayTimeRepository,
    private readonly cartLocationRepository: CartLocationRepository,
    private readonly cartDayTimeLocationRepository: CartDayTimeLocationRepository,
    private readonly cartDayTimeUserRepository: CartDayTimeUserRepository,
    private readonly cartCrewAssignedRepository: CartCrewAssignedRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  getWeek(dto: PageRequestDto) {
    return this.cartDayRepository.getMany(dto);
  }

  getTimePlan(cartDayTimeIdx: number) {
    return this.cartDayTimeRepository.getOne(cartDayTimeIdx);
  }

  createTimePlan(dto: CreateCartDayTimeDto) {
    return this.cartDayTimeRepository.createTime(dto);
  }

  updateTimePlan(dto: UpdateCartDayTimeDto) {
    return this.cartDayTimeRepository.updateTime(dto);
  }

  deleteTimePlan(cartDayTimeIdx: number) {
    return this.cartDayTimeRepository.deleteTime(cartDayTimeIdx);
  }

  getLocation(dto: PageRequestDto) {
    return this.cartLocationRepository.getMany(dto);
  }

  getLocationOne(cartLocationIdx: number) {
    return this.cartLocationRepository.getOne(cartLocationIdx);
  }

  createLocation(dto: CreateCartLocationDto) {
    return this.cartLocationRepository.createLocation(dto);
  }

  updateLocation(dto: UpdateCartLocationDto) {
    return this.cartLocationRepository.updateLocation(dto);
  }

  deleteLocation(cartLocationIdx: number) {
    return this.cartLocationRepository.deleteLocation(cartLocationIdx);
  }

  createTimeLocation(dto: CreateCartDayTimeLocationDto) {
    return this.cartDayTimeLocationRepository.createTimeLocation(dto);
  }

  deleteTimeLocation(cartDayTimeLocationIdx: number) {
    return this.cartDayTimeLocationRepository.deleteTimeLocation(
      cartDayTimeLocationIdx,
    );
  }

  createTimeUser(dto: CreateCartDayTimeUserDto) {
    return this.cartDayTimeUserRepository.createTimeUser(dto);
  }

  deleteTimeUser(cartDayTimeUserIdx: number) {
    return this.cartDayTimeUserRepository.deleteTimeUser(cartDayTimeUserIdx);
  }

  async assignCrew(dto: CreateCartCrewAssignedDto) {
    const { cartDayTimeLocationIdx, cartDayTimeUserIdxes, pushTokens } = dto;
    // 배정된 전도인 리스트 불러오기
    // 비교해서 일치시키기
    // 푸시 발송
    // const [{ idx: cartCrewAssignedIdx }] =
    //   await this.cartCrewAssignedRepository.createCrew(dto);
    // return this.cartDayTimeUserRepository.updateTimeUser({
    //   cartDayTimeUserIdx: dto.cartDayTimeUserIdx,
    //   cartCrewAssignedIdx,
    // });
  }

  deleteCrews(cartDayTimeIdx: number) {
    return this.cartDayTimeUserRepository.deleteTimeUsers(cartDayTimeIdx);
  }
}
