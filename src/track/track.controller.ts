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
import { TrackService } from './track.service';
import { CreateTrackDto, EditTrackDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Get('/by-album/:trackId')
  getAllTracks(
    @GetUser('id') userId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    console.log("trackId0000------", trackId)
    return this.trackService.getTracks(userId, trackId);
  }
  @Get(':id')
  getUserTrackById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) trackId: number,
  ) {
    return this.trackService.getTrackById(userId, trackId);
  }
  @Post("/by-album/:trackId")
  createTrack(
    @GetUser('id') userId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
    @Body() dto: CreateTrackDto,
  ) {
    return this.trackService.createTrack(userId, trackId, dto);
  }
  @Patch(':id')
  editAbum(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) trackId: number,
    @Body() dto: EditTrackDto,
  ) {
    return this.trackService.editTrack(userId, trackId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTrack(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) trackId: number,
  ) {
    return this.trackService.deleteTrack(userId, trackId);
  }
}
