import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateFavoriteDto } from './dto';
import { FavoriteService } from './favorite.service';

@UseGuards(JwtGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  async getFavorites(@GetUser('id') userId: number) {
    return await this.favoriteService.getFavorites(userId);
  }

  @Post()
  async createFavorite(@GetUser('id') userId: number, dto: CreateFavoriteDto) {
    return await this.favoriteService.createFavorite(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteFavorite(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) favoriteId: number,
  ) {
    return await this.favoriteService.deleteFavorite(userId, favoriteId);
  }
}
