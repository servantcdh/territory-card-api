import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateAccessDto {
  @IsBoolean()
  car: boolean;

  @IsBoolean()
  live: boolean;

  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  pushToken: string;

  user: User;
}
