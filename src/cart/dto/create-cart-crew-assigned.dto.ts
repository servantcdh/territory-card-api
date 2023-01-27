import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateCartCrewAssignedDto {
  @IsNumber()
  cartDayTimeLocationIdx: number;

  @IsArray()
  cartDayTimeUserIdxes: number;

  @IsOptional()
  @IsArray()
  pushTokens: string[];
}
