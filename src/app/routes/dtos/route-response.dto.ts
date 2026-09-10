export class RouteResponseDto {
  route_id!: string;
  created_by_member?: string;
  created_by_admin?: string;
  created_by_type!: 'MEMBER' | 'ADMIN';
  reviewed_by?: string;
  title!: string;
  description?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  distance_km?: number;
  meeting_point?: string;
  status!: string;
  departure_date?: Date;
  departure_time?: string;
  return_date?: Date;
  has_lodging!: boolean;
  has_restaurant!: boolean;
  base_price?: number;
  lodging_price?: number;
  restaurant_price?: number;
  total_price?: number;
  route_data?: object;
  reviewed_at?: Date;
  created_at!: Date;
  updated_at!: Date;
}
