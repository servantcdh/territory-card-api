import { CardRecord } from 'src/record/entities/card-record.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class CardContent {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', length: 150, comment: '도로명주소' })
  street: string;

  @Column({ type: 'varchar', length: 150, comment: '건물명 또는 동' })
  building: string;

  @Column({ type: 'varchar', length: 150, comment: '상호명 또는 호' })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: '전화번호' })
  phone: string;

  @Column({ type: 'bool', default: false, comment: '방문 거절 여부' })
  refusal: boolean;

  @Column({ type: 'bool', default: false, comment: '구역 카드 활성화 여부' })
  status: boolean;

  @Column({ type: 'int', comment: 'card.idx' })
  cardIdx: number;

  @ManyToOne(() => Card, card => card.cardContent, { nullable: false })
  card: Card;

  @OneToOne(() => CardRecord, (cardRecord) => cardRecord.cardContent)
  cardRecord: CardRecord;
}
