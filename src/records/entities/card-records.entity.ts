import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardRecords {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards_assigned.idx' })
  aIdx: number;

  @Column({ type: 'int', comment: 'card_contents.idx' })
  ccIdx: number;

  @Column({ type: 'int', comment: 'cards_assigned.mIdx' })
  mIdx: number;

  @Column({ type: 'tinyint', comment: 'card_marks.mark' })
  mark: number;
}
