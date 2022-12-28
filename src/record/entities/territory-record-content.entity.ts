import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TerritoryRecord } from './territory-record.entity';

@Entity()
export class TerritoryRecordContent {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    type: 'date',
    comment: 'cards_assigned.dateAssigned을 변환 (Y-m-d)',
  })
  dateAssigned: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'cards_assigned.dateCompleted을 변환 (Y-m-d)',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCompleted: string;

  @Column({ type: 'int', comment: 'territor_record.idx' })
  territoryRecordIdx: number;

  @ManyToOne(() => TerritoryRecord, (record) => record.idx)
  territoryRecord: TerritoryRecord;

  @Column({ type: 'int', comment: 'user.idx' })
  userIdx: number;

  @ManyToOne(() => User, (user) => user.idx)
  user: User;
}
