import { IsString } from 'class-validator';

export class CreateCardTagDto {
  @IsString()
  tag: string;
}
