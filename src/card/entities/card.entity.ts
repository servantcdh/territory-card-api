import { CardAssigned } from 'src/assign/entities/card-assigned.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardContent } from './card-content.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', length: 200, comment: '구역 카드' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '구역 메모' })
  memo: string;

  @Column({ type: 'bool', default: false, comment: '구역 카드 활성화 여부' })
  status: boolean;

  @OneToMany(() => CardContent, (content) => content.card)
  cardContent: CardContent[];

  @OneToMany(() => CardAssigned, (assigned) => assigned.card)
  cardAssigned: CardAssigned[];
}
