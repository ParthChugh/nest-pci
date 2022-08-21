import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDTO) {
    return this.authService.login(dto);
  }
}
