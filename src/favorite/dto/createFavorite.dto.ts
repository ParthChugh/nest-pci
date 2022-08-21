import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  link: string;
}
