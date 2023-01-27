import { IsNumber } from 'class-validator';

export class CreateCartDayTimeUserDto {
  @IsNumber()
  cartDayTimeIdx: number;

  @IsNumber()
  userIdx: number;
}
