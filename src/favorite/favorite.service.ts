import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto';
@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}
  async getFavorites(userId: number) {
    return await this.prisma.favorite.findMany({
      where: {
        userId,
      },
    });
  }
  async createFavorite(userId: number, dto: CreateFavoriteDto) {
    return await this.prisma.favorite.create({
      data: {
        userId,
      },
    });
  }
  async deleteFavorite(userId: number, favoriteId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        id: favoriteId,
      },
    });
    if (!favorite || favorite.userId !== userId) throw new ForbiddenException();
    return await this.prisma.favorite.delete({
      where: {
        id: favoriteId,
      },
    });
  }
}
