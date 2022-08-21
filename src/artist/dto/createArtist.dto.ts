import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  link: string;
}
