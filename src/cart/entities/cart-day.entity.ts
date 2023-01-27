import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartDayTime } from './cart-day-time.entity';

@Entity()
export class CartDay {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'tinyint', unique: true, comment: 'Date 객체의 dayIndex' })
  dayCode: number;

  @OneToMany(() => CartDayTime, (cartDayTime) => cartDayTime.cartDay)
  cartDayTime: CartDayTime[];
}
