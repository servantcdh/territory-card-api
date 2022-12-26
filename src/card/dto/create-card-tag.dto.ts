import { IsNumber, IsString } from 'class-validator';

export class CreateCardTagDto {
  @IsString()
  tag: string;

  @IsNumber()
  count: number;
}
