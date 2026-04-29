import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, nickname: true, avatar: true, gameId: true, rank: true, bio: true, createdAt: true,
        _count: { select: { posts: true } },
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, nickname: true, avatar: true, gameId: true, rank: true, bio: true },
    });
  }
}
