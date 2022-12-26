import { IsNumber } from 'class-validator';

export class CreateAssignedCardDto {
  @IsNumber()
  cardIdx: number;
}
