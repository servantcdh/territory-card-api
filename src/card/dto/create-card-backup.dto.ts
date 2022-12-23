import { IsNumber } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class CreateCardBackupDto extends CreateCardDto {
  @IsNumber()
  cardIdx: number;
}
