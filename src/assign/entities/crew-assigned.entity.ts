import { CardRecord } from 'src/record/entities/card-record.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardAssigned } from './card-assigned.entity';

@Entity()
export class CrewAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cardAssigned.idx', nullable: false })
  cardAssignedIdx: number;

  @ManyToOne(() => CardAssigned, (card) => card.idx, { onDelete: 'CASCADE' })
  cardAssigned: CardAssigned;

  @Column({ type: 'int', comment: '팀원 user.idx', nullable: false })
  userIdx: number;

  @ManyToOne(() => User, (user) => user.idx)
  user: User;

  @OneToMany(() => CardRecord, (cardRecord) => cardRecord.crewAssigned)
  cardRecord: CardRecord[];
}
