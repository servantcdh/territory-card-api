import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardContentBackup {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'card_contents.idx' })
  cardContentIdx: number;

  @Column({ type: 'int', comment: 'card_contents.cardIdx' })
  cardIdx: number;

  @Column({ type: 'varchar', length: 150, comment: 'card_contents.street' })
  street: string;

  @Column({ type: 'varchar', length: 150, comment: 'card_contents.building' })
  building: string;

  @Column({ type: 'varchar', length: 150, comment: 'card_contents.name' })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: 'card_contents.phone' })
  phone: string;

  @Column({ type: 'bool', default: false, comment: 'card_contents.refusal' })
  refusal: boolean;
}
