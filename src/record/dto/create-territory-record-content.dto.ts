import { IsDate, IsNumber } from 'class-validator';

export class CreateTerritoryRecordContentDto {
  @IsDate()
  dateAssigned: Date;

  @IsNumber()
  territoryRecordIdx: number;

  @IsNumber()
  userIdx: number;
}
