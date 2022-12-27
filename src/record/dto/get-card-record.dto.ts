import { IsNumber } from 'class-validator';

export class GetCardRecordDto {
  @IsNumber()
  cardAssignedIdx: number;
}
