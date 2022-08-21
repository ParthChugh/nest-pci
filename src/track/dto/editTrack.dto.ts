import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditTrackDto {
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
