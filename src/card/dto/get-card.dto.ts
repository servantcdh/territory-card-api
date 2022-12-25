import { IsOptional, IsString } from 'class-validator';
import { PageRequestDto } from 'src/shared/dto/page-request.dto';

export class GetCardDto extends PageRequestDto {
  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  tagsIgnored?: string;

  getTags(): string[] {
    if (!this.tags) {
      this.tags = '';
    }
    return this.tags.split(',').filter(value => !!value).map(value => `#${value}`);
  }

  getTagsIgnored(): string[] {
    if (!this.tagsIgnored) {
      this.tagsIgnored = '';
    }
    return this.tagsIgnored.split(',').filter(value => !!value).map(value => `#${value}`);
  }
}
