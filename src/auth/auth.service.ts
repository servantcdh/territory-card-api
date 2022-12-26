import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  OPTION = { secret: process.env.JWT_SECRET };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string) {
    const getUserDto = new GetUserDto();
    getUserDto.name = name;
    return this.userRepository.getOne(getUserDto);
  }

  async login(dto: any) {
    const payload = { name: dto.name, sub: dto.idx };
    const tokens = {
      accessToken: this.jwtService.sign(payload, {
        ...this.OPTION,
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...this.OPTION,
        expiresIn: '30d',
      }),
    }
    const accessDto: UpdateAccessDto = {
      car: false,
      live: false,
      refreshToken: tokens.refreshToken
    };
    this.updateAccess(accessDto, dto);
    return tokens;
  }

  async updateAccess(accessDto: UpdateAccessDto, getUserDto: GetUserDto | any) {
    accessDto.user = getUserDto;
    const affected = await this.authRepository.updateAccess(accessDto);
    if (!affected) {
      const createAccessDto: CreateAccessDto = {
        car: false,
        live: false,
        refreshToken: accessDto.refreshToken,
        user: accessDto.user
      }
      this.authRepository.createAccess(createAccessDto);
    }
    return accessDto;
  }

  async refreshToken(req: Request) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (this.verifyAccessToken(accessToken)) {
      const { refreshToken } = req.body;
      try {
        const { sub: userIdx, name } = this.jwtService.verify(
          refreshToken,
          this.OPTION,
        );
        const access = await this.authRepository.getOne(userIdx);
        if (access.refreshToken === refreshToken) {
          return this.login({ idx: userIdx, name })
        } else {
          throw new UnauthorizedException('not exist refreshToken');
        }
      } catch (e) {
        this.throwError(e.message)
        throw new UnauthorizedException(e.message);
      }
    }
  }

  private verifyAccessToken(accessToken: string) {
    try {
      this.jwtService.verify(accessToken, this.OPTION);
      return true;
    } catch (e) {
      return this.throwError(e.message);
    }
  }

  private throwError(errorMessage: string) {
    switch (errorMessage) {
      case 'jwt expired':
        return true;
      case 'invalid signature':
        throw new UnauthorizedException('유효하지 않은 서명');
      case 'invalid token':
        throw new UnauthorizedException('유효하지 않은 토큰');
      case 'jwt malformed':
        throw new UnauthorizedException('위변조된 토큰');
      case 'not exist refreshToken':
        throw new UnauthorizedException('없는 갱신 토큰');
      default:
        throw new UnauthorizedException('토큰 검증을 실패');
    }
  }
}
