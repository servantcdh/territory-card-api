import { IsNumber, IsOptional } from 'class-validator';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';

export class GetAssignedCardDto extends PageRequestDto {
  @IsOptional()
  @IsNumber()
  userIdx?: number;
}
