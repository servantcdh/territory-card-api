import { IsNumber } from 'class-validator';

export class CreateCartCrewAssignedDto {
  @IsNumber()
  cartDayTimeLocationIdx: number;

  @IsNumber()
  cartDayTimeUserIdx: number;
}
