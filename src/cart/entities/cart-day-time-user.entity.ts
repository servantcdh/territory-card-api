import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartCrewAssigned } from './cart-crew-assigned.entity';
import { CartDayTime } from './cart-day-time.entity';

@Entity()
export class CartDayTimeUser {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cartDayTime.idx' })
  cartDayTimeIdx: number;

  @ManyToOne(() => CartDayTime, (cartDayTime) => cartDayTime.idx, {
    onDelete: 'CASCADE',
  })
  cartDayTime: CartDayTime;

  @Column({ type: 'int', comment: 'user.idx' })
  userIdx: number;

  @ManyToOne(() => User, (user) => user.idx, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'int', comment: 'cartCrewAssigned.idx' })
  cartCrewAssignedIdx: number;

  @OneToOne(() => CartCrewAssigned)
  cartCrewAssigned: CartCrewAssigned;
}
