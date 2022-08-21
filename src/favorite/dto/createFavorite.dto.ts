import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @IsNumber()
  @IsOptional()
  trackId?: string;

  @IsNumber()
  @IsOptional()
  artistId?: string;

  @IsNumber()
  @IsOptional()
  albumId?: string;
}
