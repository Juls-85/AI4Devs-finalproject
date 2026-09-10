import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsEnum(['ROUTE', 'GENERAL', 'REMINDER'])
  @IsOptional()
  type?: 'ROUTE' | 'GENERAL' | 'REMINDER';

  @IsString()
  @IsOptional()
  route_id?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduled_at?: Date;
}
