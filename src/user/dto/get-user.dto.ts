import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';

export class GetUserDto extends PageRequestDto {
  @IsOptional()
  @IsNumber()
  idx?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
