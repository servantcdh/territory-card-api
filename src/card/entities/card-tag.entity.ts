import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CardTag {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar', unique: true, length: 100, comment: '해시태그' })
  tag: string;

  @Column({ type: 'int', comment: '사용횟수' })
  count: number;
}
