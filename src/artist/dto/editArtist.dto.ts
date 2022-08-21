import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditArtistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;
}
