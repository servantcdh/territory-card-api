import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartDayTimeLocation } from './entities/cart-day-time-location.entity';
import { CartDayTimeUser } from './entities/cart-day-time-user.entity';
import { CartDayTime } from './entities/cart-day-time.entity';
import { CartDay } from './entities/cart-day.entity';
import { CartLocation } from './entities/cart-location.entity';
import { CartDayRepository } from './repositories/cart-day.repository';
import { CartDayTimeRepository } from './repositories/cart-day-time.repository';
import { CartLocationRepository } from './repositories/cart-location.repository';
import { CartDayTimeLocationRepository } from './repositories/cart-day-time-location.repository';
import { CartDayTimeUserRepository } from './repositories/cart-day-time-user.repository';
import { CartCrewAssigned } from './entities/cart-crew-assigned.entity';
import { CartCrewAssignedRepository } from './repositories/cart-crew-assigned.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartDay,
      CartDayTime,
      CartDayTimeLocation,
      CartDayTimeUser,
      CartLocation,
      CartCrewAssigned,
      User,
    ]),
  ],
  controllers: [CartController],
  providers: [
    JwtStrategy,
    CartService,
    CartDayRepository,
    CartDayTimeRepository,
    CartLocationRepository,
    CartDayTimeLocationRepository,
    CartDayTimeUserRepository,
    CartCrewAssignedRepository,
  ],
})
export class CartModule {}
