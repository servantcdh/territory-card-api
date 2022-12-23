import { IsBoolean, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateAccessDto {
  @IsBoolean()
  car: boolean;

  @IsBoolean()
  status: boolean;

  @IsString()
  refreshToken: string;

  user: User;
}
