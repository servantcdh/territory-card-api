import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserRepository } from './repositories/user.repository';
import { hashSync } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getMany(dto: GetUserDto) {
    return this.userRepository.getMany(dto);
  }

  async getOne(idx: number) {
    const getUserDto: any = { idx };
    const user = await this.userRepository.getOne(getUserDto);
    if (!user) {
      throw new NotFoundException(`없는 사용자 Idx: ${idx}`);
    }
    const { password, ...result } = user;
    return result;
  }

  async createUser(dto: CreateUserDto) {
    dto.password = hashSync(dto.password, 10);
    const idx = await this.userRepository.createUser(dto);
    return { idx };
  }

  updateUser(dto: UpdateUserDto) {
    dto.password = hashSync(dto.password, 10);
    return this.userRepository.updateUser(dto);
  }
}
