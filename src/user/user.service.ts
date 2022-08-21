import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private primsa: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.primsa.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash
    return user
  }
}
