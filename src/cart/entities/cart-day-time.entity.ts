import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartDayTimeLocation } from './cart-day-time-location.entity';
import { CartDayTimeUser } from './cart-day-time-user.entity';
import { CartDay } from './cart-day.entity';

@Entity()
export class CartDayTime {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cartDay.idx', nullable: false })
  cartDayIdx: number;

  @ManyToOne(() => CartDay, (cartDay) => cartDay.cartDayTime, {
    onDelete: 'CASCADE',
  })
  cartDay: CartDay;

  @OneToMany(
    () => CartDayTimeUser,
    (cartDayTimeUser) => cartDayTimeUser.cartDayTime,
  )
  cartDayTimeUser: CartDayTimeUser[];

  @OneToMany(
    () => CartDayTimeLocation,
    (cartDayTimeLocation) => cartDayTimeLocation.cartDayTime,
  )
  cartDayTimeLocation: CartDayTimeLocation[];

  @Column({
    type: 'varchar',
    comment: '전시대 시작 시간(오전/오후 hh:mm)',
  })
  startTime: string;

  @Column({
    type: 'varchar',
    comment: '전시대 종료 시간(오전/오후 hh:mm)',
  })
  endTime: string;
}
