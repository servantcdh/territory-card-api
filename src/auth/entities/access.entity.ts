import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Access {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'boolean', default: false, comment: '차량 사용 가능 여부' })
  car: boolean;

  @Column({ type: 'boolean', default: false, comment: '접속 여부' })
  live: boolean;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: '세션 갱신 토큰',
  })
  refreshToken: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: 'FCM 토큰',
  })
  pushToken: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
