import { CardAssigned } from 'src/assign/entities/card-assigned.entity';
import { CardContent } from 'src/card/entities/card-content.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardMark } from './card-mark.entity';

@Entity()
export class CardRecord {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cardAssigned.idx', nullable: false })
  cardAssignedIdx: number;

  @ManyToOne(() => CardAssigned, (cardAssigned) => cardAssigned.idx)
  cardAssigned: CardAssigned;

  @Column({ type: 'int', comment: 'cardContent.idx', nullable: false })
  cardContentIdx: number;

  @OneToOne(() => CardContent, (cardContent) => cardContent.cardRecord)
  @JoinColumn()
  cardContent: CardContent;

  @Column({ type: 'int', comment: 'cardMark.idx', nullable: false })
  cardMarkIdx: number;

  @ManyToOne(() => CardMark, (cardMark) => cardMark.mark)
  cardMark: CardMark;
}
