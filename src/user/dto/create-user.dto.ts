import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsBoolean()
  gender: boolean;

  @IsBoolean()
  guide: boolean;

  @IsBoolean()
  auth: boolean;

  @IsBoolean()
  baptize: boolean;

  @IsBoolean()
  car: boolean;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsBoolean()
  status: boolean;
}
