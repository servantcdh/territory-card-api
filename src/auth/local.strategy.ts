import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'name' });
  }

  async validate(name: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(name);
    if (!user) {
      throw new UnauthorizedException(`없는 사용자명: ${name}`);
    }
    const { password: hash, ...result } = user;
    if (!compareSync(password, hash)) {
      throw new UnauthorizedException('잘못된 암호');
    }
    return result;
  }
}
