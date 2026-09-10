import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class ReviewRouteProposalDto {
  @IsEnum(['PUBLISHED', 'REJECTED'])
  @IsNotEmpty()
  status!: 'PUBLISHED' | 'REJECTED';

  @IsString()
  reason?: string;
}
