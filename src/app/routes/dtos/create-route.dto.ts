import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['EASY', 'MEDIUM', 'HARD'])
  @IsOptional()
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';

  @IsDecimal()
  @IsOptional()
  distance_km?: number;

  @IsString()
  @IsOptional()
  meeting_point?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  departure_date?: Date;

  @IsString()
  @IsOptional()
  departure_time?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  return_date?: Date;

  @IsBoolean()
  @IsOptional()
  has_lodging?: boolean;

  @IsBoolean()
  @IsOptional()
  has_restaurant?: boolean;

  @IsDecimal()
  @IsOptional()
  base_price?: number;

  @IsDecimal()
  @IsOptional()
  lodging_price?: number;

  @IsDecimal()
  @IsOptional()
  restaurant_price?: number;

  @IsDecimal()
  @IsOptional()
  total_price?: number;

  @IsOptional()
  route_data?: object;

  @IsEnum(['PROPOSAL', 'PENDING_REVIEW', 'PUBLISHED', 'DRAFT'])
  @IsOptional()
  status?: string;
}
