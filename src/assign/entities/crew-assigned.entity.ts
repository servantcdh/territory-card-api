import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardAssigned } from './card-assigned.entity';

@Entity()
export class CrewAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne(() => CardAssigned, card => card.idx)
  card: CardAssigned;

  @ManyToOne(() => User, user => user.idx)
  user: User;
}
