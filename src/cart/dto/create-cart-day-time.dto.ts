import { IsNumber, IsString } from 'class-validator';

export class CreateCartDayTimeDto {
  @IsNumber()
  cartDayIdx: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
