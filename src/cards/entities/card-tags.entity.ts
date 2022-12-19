import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardTags {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards.idx' })
  cIdx: number;

  @Column({ type: 'varchar', length: 100, comment: '해시태그' })
  tag: string;
}
