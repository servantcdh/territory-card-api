import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsOptional()
  @IsNumber()
  idx?: number;

  @IsOptional()
  @IsNumber()
  memoFocusUserIdx?: number;

  @IsBoolean()
  status: boolean;
}
