import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardContents {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards.idx' })
  cIdx: number;

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
}
