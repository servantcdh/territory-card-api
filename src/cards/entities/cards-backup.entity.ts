import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardsBackup {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards.idx' })
  cIdx: number;

  @Column({ type: 'varchar', length: 200, comment: 'cards.name' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'cards.memo' })
  memo: string;
}
