import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { AuthDTO } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

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
          .expectStatus(201)
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
              .expectBodyContains(dto.email)
          });
        });
      });
    });
  });
});
