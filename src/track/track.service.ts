import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto, EditTrackDto } from './dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getTracks(userId: number, albumId: number) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });
    if (!album) throw new ForbiddenException("Album Doesn't exist");
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (!artist) throw new ForbiddenException("Artist doesn't");
    const tracks = await this.prisma.track.findMany({
      where: {
        albumId,
      },
    });
    if (artist.userId !== userId) throw new ForbiddenException();
    return tracks;
  }
  async getTrackById(userId: number, trackId: number) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });
    if (!track) throw new ForbiddenException("Track Doesn't exist");
    const album = await this.prisma.album.findUnique({
      where: {
        id: track.albumId,
      },
    });
    if (!album) throw new ForbiddenException('Access Denind');
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (artist?.userId !== userId) throw new ForbiddenException();
    return track;
  }
  async createTrack(userId: number, albumId: number, dto: CreateTrackDto) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });
    if (!album) throw new ForbiddenException('Access Denind');
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (!artist || artist?.userId !== userId)
      throw new ForbiddenException('Access Denind');

    return await this.prisma.track.create({
      data: { albumId, ...dto },
    });
  }
  async editTrack(userId: number, trackId: number, dto: EditTrackDto) {
    const track = await this.prisma.track.findFirst({
      where: {
        id: trackId,
      },
    });
    if (!track) throw new ForbiddenException();
    const album = await this.prisma.album.findUnique({
      where: {
        id: track.albumId,
      },
    });
    if (!album) throw new ForbiddenException('Access Denind');
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (!artist || artist.userId !== userId)
      throw new ForbiddenException('Access denied');
    return await this.prisma.track.update({
      where: {
        id: trackId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteTrack(userId: number, trackId: number) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });
    if (!track) throw new ForbiddenException("Track doesn't exist");
    const album = await this.prisma.album.findUnique({
      where: {
        id: track.albumId,
      },
    });
    if (!album) throw new ForbiddenException('Access Denind');
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: album.artistId,
      },
    });
    if (!artist) throw new ForbiddenException('Access denied');
    return await this.prisma.track.delete({
      where: {
        id: trackId,
      },
    });
  }
}
