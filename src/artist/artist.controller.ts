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
import { CreateArtistDto, EditArtistDto } from './dto';
import { ArtistService } from './artist.service';

@UseGuards(JwtGuard)
@Controller('artists')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getAllArtists(@GetUser('id') userId: number) {
    return this.artistService.getUserArtists(userId);
  }
  @Get(':id')
  getUserArtistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
  ) {
    return this.artistService.getUserArtistById(userId, albumId);
  }
  @Post()
  createArtist(@GetUser('id') userId: number, @Body() dto: CreateArtistDto) {
    return this.artistService.createArtist(userId, dto);
  }
  @Patch(':id')
  editAbum(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
    @Body() dto: EditArtistDto,
  ) {
    return this.artistService.editArtist(userId, albumId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArtist(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) albumId: number,
  ) {
    return this.artistService.deleteArtist(userId, albumId);
  }
}
