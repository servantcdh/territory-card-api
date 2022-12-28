import { Card } from 'src/card/entities/card.entity';
import { CardRecord } from 'src/record/entities/card-record.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CrewAssigned } from './crew-assigned.entity';

@Entity()
export class CardAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '배정 날짜 (Y-m-d H:i:s)',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateAssigned: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '반납 날짜 (Y-m-d H:i:s)',
  })
  dateCompleted: string;

  @Column({ type: 'int', comment: 'card.idx', nullable: false })
  cardIdx: number;

  @ManyToOne(() => Card, (card) => card.idx)
  card: Card;

  @Column({ type: 'int', comment: '대표전도인 user.idx', nullable: true })
  userIdx: number;

  @ManyToOne(() => User, (user) => user.idx)
  user: User;

  @OneToMany(() => CrewAssigned, (assigned) => assigned.cardAssigned, {
    cascade: true,
  })
  crewAssigned: CrewAssigned[];

  @OneToMany(() => CardRecord, (assigned) => assigned.cardAssigned)
  cardRecord: CardRecord[];
}
