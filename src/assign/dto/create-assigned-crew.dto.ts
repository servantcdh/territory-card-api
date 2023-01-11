import { IsArray, IsNumber } from 'class-validator';

export class CreateAssignedCrewDto {
  @IsNumber()
  cardAssignedIdx: number;

  @IsArray()
  userIdxes: number[];
}
