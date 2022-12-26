import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';

export class GetUserSearchDto extends PageRequestDto {
  @IsOptional()
  @IsString()
  search?: string;
}
