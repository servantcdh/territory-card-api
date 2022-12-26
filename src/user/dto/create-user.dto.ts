import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
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
  driver: boolean;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsBoolean()
  status: boolean;
}
