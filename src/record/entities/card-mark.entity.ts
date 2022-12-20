import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardMark {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'tinyint', unique: true, comment: '항목 번호' })
  mark: number;

  @Column({ type: 'varchar', length: 100, comment: '항목 이름' })
  name: string;
}
