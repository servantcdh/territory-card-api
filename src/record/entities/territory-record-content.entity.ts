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
  dateAssigned: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'cards_assigned.dateCompleted을 변환 (Y-m-d)',
  })
  dateCompleted: string;

  @ManyToOne(() => TerritoryRecord, (record) => record.idx)
  record: TerritoryRecord;

  @ManyToOne(() => User, (user) => user.idx)
  user: User;
}
