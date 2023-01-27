import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartLocation {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    type: 'varchar',
    comment: '전시대 구역 위도',
  })
  lat: string;

  @Column({
    type: 'varchar',
    comment: '전시대 구역 경도',
  })
  lng: string;

  @Column({
    type: 'varchar',
    comment: '전시대 구역 이름',
  })
  name: string;
}
