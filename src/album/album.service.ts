import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto, EditAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAlbums(userId: number, artistId: number) {
    const artist = await this.prisma.artist.findFirst({
      where: {
        id: artistId,
        userId,
      },
    });
    if (!artist) throw new ForbiddenException();
    const albums = await this.prisma.album.findMany({
      where: {
        artistId,
      },
    });
    if (artist.userId !== userId) throw new ForbiddenException();
    return albums;
  }
  async getAlbumById(userId: number, albumId: number) {
    const album = await this.prisma.album.findFirst({
      where: {
        id: albumId,
      },
    });
    const artist = await this.prisma.artist.findFirst({
      where: {
        id: album.artistId,
        userId,
      },
    });
    if (artist?.userId !== userId) throw new ForbiddenException();
    return album;
  }
  async createAlbum(userId: number, artistId: number, dto: CreateAlbumDto) {
    const artist = await this.prisma.artist.findFirst({
      where: {
        id: artistId,
      },
    });
    if (!artist || artist?.userId !== userId)
      throw new ForbiddenException('Access Denind');

    return await this.prisma.album.create({
      data: { artistId, ...dto },
    });
  }
  async editAlbum(userId: number, albumId: number, dto: EditAlbumDto) {
    const album = await this.prisma.album.findFirst({
      where: {
        id: albumId,
      },
    });
    if (!album) throw new ForbiddenException();
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (!artist || artist.userId !== userId)
      throw new ForbiddenException('Access denied');
    return await this.prisma.album.update({
      where: {
        id: albumId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteAlbum(userId: number, albumId: number) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });
    const artist = await this.prisma.artist.findFirst({
      where: {
        id: album.artistId,
        userId,
      },
    });
    if (!artist) throw new ForbiddenException('Access denied');
    return await this.prisma.album.delete({
      where: {
        id: albumId,
      },
    });
  }
}
