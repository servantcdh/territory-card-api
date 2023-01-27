import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartCrewAssigned } from './cart-crew-assigned.entity';
import { CartDayTime } from './cart-day-time.entity';
import { CartLocation } from './cart-location.entity';

@Entity()
export class CartDayTimeLocation {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cartDayTime.idx' })
  cartDayTimeIdx: number;

  @ManyToOne(() => CartDayTime, (cartDayTime) => cartDayTime.idx, {
    onDelete: 'CASCADE',
  })
  cartDayTime: CartDayTime;

  @Column({ type: 'int', comment: 'cartLocation.idx' })
  cartLocationIdx: number;

  @ManyToOne(() => CartLocation, (cartLocation) => cartLocation.idx, {
    onDelete: 'CASCADE',
  })
  cartLocation: CartLocation;

  @OneToMany(
    () => CartCrewAssigned,
    (cartCrewAssigned) => cartCrewAssigned.cartDayTimeLocation,
  )
  cartCrewAssigned: CartCrewAssigned[];
}
