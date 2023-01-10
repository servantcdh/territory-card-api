import { IsString } from 'class-validator';

export class CreateAssignedCardDto {
  @IsString()
  cardIdxes: string;
}
