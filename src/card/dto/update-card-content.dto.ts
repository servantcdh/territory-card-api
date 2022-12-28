import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateCardContentDto } from './create-card-content.dto';

export class UpdateCardContentDto extends PartialType(CreateCardContentDto) {
  @IsNumber()
  cardContentIdx: number;
}
