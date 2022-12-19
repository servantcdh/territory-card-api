import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Accesses {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', unique: true, comment: 'members.idx' })
  mIdx: number;

  @Column({ type: 'boolean', default: false, comment: '차량 사용 가능 여부' })
  car: boolean;

  @Column({ type: 'boolean', default: false, comment: '접속 여부' })
  status: boolean;
}
