import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateCardRecordParamsDto {
  @IsNumber()
  @Type(() => Number)
  cardAssignedIdx: number;

  @IsNumber()
  @Type(() => Number)
  cardContentIdx: number;
}
