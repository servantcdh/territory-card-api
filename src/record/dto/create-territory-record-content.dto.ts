import { IsNumber, IsString } from 'class-validator';

export class CreateTerritoryRecordContentDto {
  @IsString()
  dateAssigned: string;

  @IsString()
  dateCompleted: string;

  @IsNumber()
  territoryRecordIdx: number;

  @IsNumber()
  userIdx: number;
}
