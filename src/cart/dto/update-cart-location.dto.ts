import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateCartLocationDto } from './create-cart-location.dto';

export class UpdateCartLocationDto extends PartialType(CreateCartLocationDto) {
  @IsNumber()
  cartLocationIdx: number;
}
