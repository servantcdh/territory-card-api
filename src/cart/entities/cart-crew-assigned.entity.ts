import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartDayTimeLocation } from './cart-day-time-location.entity';
import { CartDayTimeUser } from './cart-day-time-user.entity';

@Entity()
export class CartCrewAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cartDayTimeLocation.idx', nullable: false })
  cartDayTimeLocationIdx: number;

  @ManyToOne(
    () => CartDayTimeLocation,
    (cartDayTimeLocation) => cartDayTimeLocation.cartDayTime,
    {
      onDelete: 'CASCADE',
    },
  )
  cartDayTimeLocation: CartDayTimeLocation;

  @Column({ type: 'int', comment: 'cartDayTimeUser.idx' })
  cartDayTimeUserIdx: number;

  @OneToOne(() => CartDayTimeUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cartDayTimeUser: CartDayTimeUser;
}
