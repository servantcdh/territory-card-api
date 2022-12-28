import { IsNumber, IsString } from 'class-validator';

export class CreateTerritoryRecordContentDto {
  @IsString()
  dateAssigned: string;

  @IsNumber()
  territoryRecordIdx: number;

  @IsNumber()
  userIdx: number;
}
