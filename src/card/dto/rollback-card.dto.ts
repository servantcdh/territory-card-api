import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class RollbackCardDto {
  @Type(() => Number)
  @IsNumber()
  cardIdx: number;

  @Type(() => Number)
  @IsNumber()
  cardBackupIdx: number;
}
