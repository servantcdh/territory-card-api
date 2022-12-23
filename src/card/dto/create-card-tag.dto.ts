import { IsString } from 'class-validator';
import { Card } from '../entities/card.entity';

export class CreateCardTagDto {
  card: Card;

  @IsString()
  tag: string;
}
