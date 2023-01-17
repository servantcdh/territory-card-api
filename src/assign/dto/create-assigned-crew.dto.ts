import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateAssignedCrewDto {
  @IsNumber()
  cardAssignedIdx: number;

  @IsArray()
  userIdxes: number[];

  @IsOptional()
  @IsArray()
  pushTokens: string[];
}
