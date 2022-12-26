import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCardContentDto {
  @IsNumber()
  cardIdx: number;

  @IsString()
  street: string;

  @IsString()
  building: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsBoolean()
  refusal: boolean;
}
