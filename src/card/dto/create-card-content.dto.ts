import { IsBoolean, IsString } from 'class-validator';
import { Card } from '../entities/card.entity';

export class CreateCardContentDto {
  card: Card;

  @IsString()
  street: string;

  @IsString()
  building: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsBoolean()
  refusal: boolean;
}
