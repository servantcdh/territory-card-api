import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TerritoryRecordContent } from './territory-record-content.entity';

@Entity()
export class TerritoryRecord {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: '봉사연도 (YYYY)' })
  serviceYear: number;

  @Column({
    type: 'date',
    comment: '마지막으로 완료한 날짜 (Y-m-d)',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastDateCompleted: string;

  @Column({ type: 'int', comment: 'card.idx' })
  cardIdx: number;

  @ManyToOne(() => Card, (card) => card.idx)
  card: Card;

  @OneToMany(
    () => TerritoryRecordContent,
    (territoryRecordContent) => territoryRecordContent.territoryRecord,
  )
  territoryRecordContent: TerritoryRecordContent[];
}
