import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AlbumService } from './album.service';
import { CreateAlbumDto, EditAlbumDto } from './dto';

@UseGuards(JwtGuard)
@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}
  @Get('/by-artist/:artistId')
  getAllAlbums(
    @GetUser('id') userId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
  ) {
    return this.albumService.getAlbums(userId, artistId);
  }
  @Get(':id')
  getUserAlbumById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
  ) {
    return this.albumService.getAlbumById(userId, albumId);
  }
  @Post("/by-artist/:artistId")
  createAlbum(
    @GetUser('id') userId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() dto: CreateAlbumDto,
  ) {
    return this.albumService.createAlbum(userId, artistId, dto);
  }
  @Patch(':id')
  editAbum(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
    @Body() dto: EditAlbumDto,
  ) {
    return this.albumService.editAlbum(userId, albumId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAlbum(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
  ) {
    return this.albumService.deleteAlbum(userId, albumId);
  }
}
