import { Card } from 'src/card/entities/card.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TerritoryRecord {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: '봉사연도 (YYYY)' })
  serviceYear: number;

  @Column({ type: 'date', comment: '마지막으로 완료한 날짜 (Y-m-d)' })
  lastDateCompleted: string;

  @ManyToOne(() => Card, (card) => card.idx)
  card: Card;
}
