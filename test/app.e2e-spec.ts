import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { AuthDTO } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateArtistDto, EditArtistDto } from '../src/artist/dto';
import { CreateAlbumDto } from 'src/album/dto';

describe('App init', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);
    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3001');
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      const dto: AuthDTO = {
        email: 'vasd@asd.com',
        password: 'Password@123',
      };
      it('should thow if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should thow if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should thow if email and password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      describe('Sign in', () => {
        it('should thow if email empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              password: dto.password,
            })
            .expectStatus(400);
        });
        it('should thow if password empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: dto.email,
            })
            .expectStatus(400);
        });
        it('should sign in', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .stores('userAt', 'access_token');
        });
      });
      describe('User', () => {
        describe('Get me', () => {
          it('get me', () => {
            return pactum
              .spec()
              .get('/users/me')
              .withHeaders({
                Authorization: `Bearer $S{userAt}`,
              })
              .expectStatus(200);
          });
        });
        describe('Edit User', () => {
          const dto: EditUserDto = {
            email: 'dwdqw@as.com',
            firstName: 'qwdqwd',
          };
          it('should edit user', () => {
            return pactum
              .spec()
              .patch('/users')
              .withBody(dto)
              .withHeaders({
                Authorization: `Bearer $S{userAt}`,
              })
              .expectStatus(200)
              .expectBodyContains(dto.email);
          });
        });
      });
    });
  });
  describe('Artists', () => {
    describe('get Artists', () => {
      it('should get empty artists', async () => {
        return pactum
          .spec()
          .get('/artists')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });

      it('create artist', async () => {
        const dto: CreateArtistDto = {
          name: 'FL_WEB',
          description: '58, 6,528 updated on Jul 14, 2022',
          link: 'https://www.youtube.com/playlist?list=PLDxO0t2Gkko-nZivNhrmYjZhZ6lM5NX6A',
        };
        return pactum
          .spec()
          .post('/artists')
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .stores('artist_id', 'id')
          .expectStatus(201);
      });
      it('should get one artist', async () => {
        return pactum
          .spec()
          .get('/artists')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
      it('edit artist', async () => {
        const dto: EditArtistDto = {
          description: '58, 7,528 updated on Jul 14, 2022',
        };
        return pactum
          .spec()
          .patch('/artists/$S{artist_id}')
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
      it('should singleartist', async () => {
        return pactum
          .spec()
          .get('/artists/$S{artist_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBodyContains('$S{artist_id}');
      });
      it('delete artist', async () => {
        return pactum
          .spec()
          .delete('/artists/$S{artist_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(204);
      });
      it('should get empty artists', async () => {
        return pactum
          .spec()
          .get('/artists')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
  describe('Albums', () => {
    describe('get Albums', () => {
      it('Create Artist', async () => {
        const dto: CreateArtistDto = {
          name: 'FL_WEB',
          description: '58, 6,528 updated on Jul 14, 2022',
          link: 'https://www.youtube.com/playlist?list=PLDxO0t2Gkko-nZivNhrmYjZhZ6lM5NX6A',
        };
        return pactum
          .spec()
          .post('/artists')
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .stores('artist_id', 'id')
          .expectStatus(201);
      });

      it('should get empty albums', async () => {
        return pactum
          .spec()
          .get('/albums/by-artist/$S{artist_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });

      it('create album', async () => {
        const dto: CreateAlbumDto = {
          title: 'FL_WEB Random',
          description: '159, 6,528 updated on Jul 14, 2022',
          link: 'https://www.youtube.com/playlist?list=PLDxO0t2Gkko-nZivNhrmYjZhZ6lM5NX6A',
        };
        return pactum
          .spec()
          .post('/albums/by-artist/$S{artist_id}')
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(201);
      });
      it('should get one album', async () => {
        return pactum
          .spec()
          .get('/albums/by-artist/$S{artist_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .stores('album_id', 'id')
          .expectJsonLength(1);
      });
      it('should get one album', async () => {
        return pactum
          .spec()
          .get('/albums/$S{album_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .inspect();
      });
      it('edit album', async () => {
        const dto: EditArtistDto = {
          description: '58, 7,528 updated on Jul 14, 2022',
        };
        return pactum
          .spec()
          .patch('/albums/$S{album_id}')
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
      it('delete album', async () => {
        return pactum
          .spec()
          .delete('/albums/$S{album_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(204);
      });
      it('should get empty albums after deleting', async () => {
        return pactum
          .spec()
          .get('/albums/by-artist/$S{artist_id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
