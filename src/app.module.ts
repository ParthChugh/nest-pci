import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlbumController } from './album/album.controller';
import { TrackController } from './track/track.controller';
import { ArtistController } from './artist/artist.controller';
import { FavoriteController } from './favorite/favorite.controller';
import { AlbumService } from './album/album.service';
import { TrackService } from './track/track.service';
import { ArtistService } from './artist/artist.service';
import { FavoriteService } from './favorite/favorite.service';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { FavoriteModule } from './favorite/favorite.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    AlbumModule,
    ArtistModule,
    FavoriteModule,
    TrackModule,
  ],
  controllers: [AlbumController, TrackController, ArtistController, FavoriteController],
  providers: [AlbumService, TrackService, ArtistService, FavoriteService],
})
export class AppModule {}
