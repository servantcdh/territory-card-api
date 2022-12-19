import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TerritoryRecords {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: '봉사연도 (YYYY)' })
  serviceYear: number;

  @Column({ type: 'int', comment: 'cards.idx' })
  cIdx: number;

  @Column({ type: 'date', comment: '마지막으로 완료한 날짜 (Y-m-d)' })
  lastDateCompleted: string;
}
