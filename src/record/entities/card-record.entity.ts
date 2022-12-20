import { CardAssigned } from 'src/assign/entities/card_assigned.entity';
import { CrewAssigned } from 'src/assign/entities/crew_assigned.entity';
import { CardContent } from 'src/card/entities/card-content.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardMark } from './card-mark.entity';

@Entity()
export class CardRecord {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne(() => CardAssigned, (card) => card.idx)
  card: CardAssigned;

  @ManyToOne(() => CardContent, (content) => content.idx)
  content: CardContent;

  @ManyToOne(() => CrewAssigned, (crew) => crew.user)
  user: User;

  @ManyToOne(() => CardMark, (cardMark) => cardMark.mark)
  cardMark: CardMark;
}
