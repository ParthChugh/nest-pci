import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      return { access_token: await this.signToken(user.id, user.email) };
    } catch (error) {
      throw new ForbiddenException('Credential Token');
    }
  }
  async login(dto: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    
    return { access_token: await this.signToken(user.id, user.email) };
  }
  signToken(userId: number, email: string): Promise<string> {
    const data = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(data, {
      expiresIn: '20m',
      secret,
    });
  }
}
