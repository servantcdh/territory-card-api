import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CardAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @CreateDateColumn({ type: 'timestamp', comment: '배정 날짜 (Y-m-d H:i:s)' })
  dateAssigned: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '반납 날짜 (Y-m-d H:i:s)',
  })
  dateCompleted: number;
  
  @ManyToOne(() => Card, card => card.idx)
  card: Card;

  @ManyToOne(() => User, user => user.idx)
  user: User;
}
