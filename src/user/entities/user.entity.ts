import { Access } from 'src/auth/entities/access.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: '사용자 이름',
  })
  name: string;

  @Column({ type: 'varchar', length: 300, comment: '암호' })
  password: string;

  @Column({ type: 'bool', default: false, comment: '형제 여부' })
  gender: boolean;

  @Column({ type: 'bool', default: false, comment: '인도자 여부' })
  guide: boolean;

  @Column({ type: 'bool', default: false, comment: '관리자 여부' })
  auth: boolean;

  @Column({ type: 'bool', default: false, comment: '침례 여부' })
  baptize: boolean;

  @Column({ type: 'bool', default: false, comment: '차량 소유 여부' })
  car: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '프로필 사진 파일명',
  })
  profile: string;

  @Column({ type: 'bool', default: false, comment: '계정 활성화 여부' })
  status: boolean;
}
