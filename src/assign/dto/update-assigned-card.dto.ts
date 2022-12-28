import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAssignedCardDto } from './create-assigned-card.dto';

export class UpdateAssignedCardDto extends PartialType(CreateAssignedCardDto) {
  @IsOptional()
  @IsNumber()
  cardAssignedIdx?: number;

  @IsOptional()
  @IsDate()
  dateCompleted?: Date;

  @IsOptional()
  @IsNumber()
  userIdx?: number;
}
