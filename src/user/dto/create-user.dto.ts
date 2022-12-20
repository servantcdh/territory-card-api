import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumber()
  gender: number;

  @IsNumber()
  guide: number;

  @IsNumber()
  auth: number;

  @IsNumber()
  baptize: number;

  @IsNumber()
  car: number;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsNumber()
  status: number;
}
