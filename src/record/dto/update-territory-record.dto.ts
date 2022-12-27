import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { CreateTerritoryRecordDto } from './create-territory-record.dto';

export class UpdateTerritoryRecordDto extends PartialType(
  CreateTerritoryRecordDto,
) {
  @IsNumber()
  territoryRecordIdx: number;

  @IsOptional()
  @IsDate()
  lastDateCompleted?: Date;
}
