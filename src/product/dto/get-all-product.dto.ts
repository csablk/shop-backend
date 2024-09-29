import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

export enum ProductSort {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
