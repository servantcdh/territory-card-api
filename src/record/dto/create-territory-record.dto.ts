import { IsNumber } from 'class-validator';

export class CreateTerritoryRecordDto {
  @IsNumber()
  serviceYear: number;

  @IsNumber()
  cardIdx: number;
}
