import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class CardTag {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', length: 100, comment: '해시태그' })
  tag: string;

  @ManyToOne(() => Card, card => card.idx)
  card: Card;
}
