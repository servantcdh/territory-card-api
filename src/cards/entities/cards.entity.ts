import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cards {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', length: 200, comment: '구역 카드' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '구역 메모' })
  memo: string;

  @Column({ type: 'bool', default: false, comment: '구역 카드 활성화 여부' })
  status: boolean;
}
