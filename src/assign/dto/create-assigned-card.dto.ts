import { IsArray } from 'class-validator';

export class CreateAssignedCardDto {
  @IsArray()
  cardIdxes: number[];
}
