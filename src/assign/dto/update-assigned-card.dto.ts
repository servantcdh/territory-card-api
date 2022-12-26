import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateAssignedCardDto } from './create-assigned-card.dto';

export class UpdateAssignedCardDto extends PartialType(CreateAssignedCardDto) {
  @IsOptional()
  @IsNumber()
  cardAssignedIdx?: number;

  @IsOptional()
  @IsBoolean()
  complete?: boolean;

  @IsOptional()
  @IsBoolean()
  dateCompleted?: Date;

  @IsOptional()
  @IsNumber()
  userIdx?: number;
}
