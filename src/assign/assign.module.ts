import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AssignController } from './assign.controller';
import { AssignService } from './assign.service';
import { CardAssigned } from './entities/card-assigned.entity';
import { CrewAssigned } from './entities/crew-assigned.entity';
import { CardAssignedRepository } from './repositories/card-assigned.repository';
import { CrewAssignedRepository } from './repositories/crew-assigned.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CardAssigned, CrewAssigned, User])],
  controllers: [AssignController],
  providers: [
    AssignService,
    JwtStrategy,
    CardAssignedRepository,
    CrewAssignedRepository,
    UserRepository,
  ],
})
export class AssignModule {}
