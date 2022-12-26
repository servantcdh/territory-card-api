import { IsNumber } from 'class-validator';

export class CreateAssignedCrewDto {
  @IsNumber()
  cardAssignedIdx: number;

  @IsNumber()
  userIdx: number;
}
