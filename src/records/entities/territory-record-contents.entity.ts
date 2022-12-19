import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TerritoryRecordContents {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'territory_records.idx' })
  tIdx: number;

  @Column({ type: 'varchar', length: 150, comment: 'cards_assigned.mIdxAssignedTo의 members.name' })
  nameAssignedTo: string;

  @Column({ type: 'date', comment: 'cards_assigned.dateAssigned을 변환 (Y-m-d)' })
  dateAssigned: string;

  @Column({ type: 'date', nullable: true, comment: 'cards_assigned.dateCompleted을 변환 (Y-m-d)' })
  dateCompleted: string;
}
