import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateCartDayTimeDto } from './create-cart-day-time.dto';

export class UpdateCartDayTimeDto extends PartialType(CreateCartDayTimeDto) {
  @IsNumber()
  cartDayTimeIdx: number;
}
