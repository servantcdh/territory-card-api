import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardTagBackup {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'card_tags.cardIdx' })
  cardIdx: number;

  @Column({ type: 'varchar', length: 100, comment: 'card_tags.tag' })
  tag: string;
}
