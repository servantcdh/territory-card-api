import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CardsAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards.idx' })
  cIdx: number;

  @Column({ type: 'int', comment: '대표 전도인의 members.idx' })
  mIdxAssignedTo: number;

  @CreateDateColumn({ type: 'timestamp', comment: '배정 날짜 (Y-m-d H:i:s)' })
  dateAssigned: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '반납 날짜 (Y-m-d H:i:s)',
  })
  dateCompleted: number;
}
