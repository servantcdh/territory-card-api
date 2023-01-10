import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class CardBackup {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', length: 200, comment: 'cards.name' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'cards.memo' })
  memo: string;

  @Column({ type: 'int',  comment: 'cards.idx' })
  cardIdx: number;
  
  @ManyToOne(() => Card, (card) => card.idx)
  card: Card;
}
