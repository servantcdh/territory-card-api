import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-user.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
