import { IsNumber, IsOptional } from 'class-validator';

export class CreateCardRecordDto {
  @IsOptional()
  @IsNumber()
  cardAssignedIdx?: number;

  @IsOptional()
  @IsNumber()
  cardContentIdx?: number;

  @IsOptional()
  @IsNumber()
  crewAssignedIdx?: number;

  @IsNumber()
  cardMarkIdx: 0 | 1 | 2;
}
