import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardContentsBackup {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'card_contents.idx' })
  ccIdx: number;

  @Column({ type: 'int', comment: 'card_contents.cIdx' })
  cIdx: number;

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
