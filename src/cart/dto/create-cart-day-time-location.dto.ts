import { IsNumber } from 'class-validator';

export class CreateCartDayTimeLocationDto {
  @IsNumber()
  cartDayTimeIdx: number;

  @IsNumber()
  cartLocationIdx: number;
}
