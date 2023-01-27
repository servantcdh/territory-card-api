import { IsString } from 'class-validator';

export class CreateCartLocationDto {
  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  name: string;
}
