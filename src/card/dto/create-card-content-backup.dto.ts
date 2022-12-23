import { IsNumber } from 'class-validator';
import { CreateCardContentDto } from './create-card-content.dto';

export class CreateCardContentBackupDto extends CreateCardContentDto {
  @IsNumber()
  cardContentIdx: number;
}
