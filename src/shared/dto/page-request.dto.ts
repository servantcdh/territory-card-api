import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PageRequestDto {
  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  desc?: number | 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNumber?: number | 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number | 10;

  getOffset(): number {
    if (
      this.pageNumber < 1 ||
      this.pageNumber === null ||
      this.pageNumber === undefined
    ) {
      this.pageNumber = 1;
    }
    if (
      this.pageSize < 1 ||
      this.pageSize === null ||
      this.pageSize === undefined
    ) {
      this.pageSize = 10;
    }
    return (+this.pageNumber - 1) * +this.pageSize;
  }

  getLimit(): number {
    if (
      this.pageSize < 1 ||
      this.pageSize === null ||
      this.pageSize === undefined
    ) {
      this.pageSize = 10;
    }
    return +this.pageSize;
  }
}
