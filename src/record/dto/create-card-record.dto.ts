import { IsNumber, IsOptional } from 'class-validator';

export class CreateCardRecordDto {
  @IsOptional()
  @IsNumber()
  cardAssignedIdx?: number;

  @IsOptional()
  @IsNumber()
  cardContentIdx?: number;

  @IsNumber()
  cardMarkIdx: 0 | 1 | 2;
}
