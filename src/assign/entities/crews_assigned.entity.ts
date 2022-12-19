import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CrewsAssigned {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'int', comment: 'cards_assigned.idx' })
  aIdx: number;

  @Column({ type: 'int', comment: 'members.idx' })
  mIdx: number;
}
