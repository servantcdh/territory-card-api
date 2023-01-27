import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateCartDayTimeUserDto } from './create-cart-day-time-user.dto';

export class UpdateCartDayTimeUserDto extends PartialType(CreateCartDayTimeUserDto) {
  @IsNumber()
  cartDayTimeUserIdx: number;

  @IsNumber()
  cartCrewAssignedIdx: number;
}
