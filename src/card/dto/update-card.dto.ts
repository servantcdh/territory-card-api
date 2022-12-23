import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsNumber()
    idx: number;

    @IsBoolean()
    status: boolean;
}
