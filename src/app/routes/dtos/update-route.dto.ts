import { IsString, IsOptional, IsDecimal, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRouteDto {
  @IsString()
  @IsOptional()
  title?: string;

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

  @IsEnum(['PUBLISHED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;
}
