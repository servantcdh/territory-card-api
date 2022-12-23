import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsNumber()
  idx?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
