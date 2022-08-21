import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, EditArtistDto } from './dto';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getUserArtists(userId: number) {
    return await this.prisma.artist.findMany({
      where: {
        userId,
      },
    });
  }
  getUserArtistById(userId: number, artistId: number) {
    return this.prisma.artist.findFirst({
      where: {
        id: artistId,
        userId,
      },
    });
  }
  async createArtist(userId: number, dto: CreateArtistDto) {
    return await this.prisma.artist.create({
      data: { userId, ...dto },
    });
  }
  async editArtist(userId: number, artistId: number, dto: EditArtistDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });
    if (!artist || artist.userId !== userId)
      throw new ForbiddenException('Access denied');
    return await this.prisma.artist.update({
      where: {
        id: artistId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteArtist(userId: number, artistId: number) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });
    if (!artist || artist.userId !== userId)
      throw new ForbiddenException('Access denied');
    return await this.prisma.artist.delete({
      where: {
        id: artistId,
      },
    });
  }
}
