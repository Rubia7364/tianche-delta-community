import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    return this.prisma.post.create({
      data: { ...data, userId },
      include: { author: { select: { id: true, nickname: true, avatar: true } } },
    });
  }

  async findAll(page = 1, limit = 20, sort = 'latest') {
    const skip = (page - 1) * limit;
    const orderBy = sort === 'hot' ? { likes: 'desc' as const } : { createdAt: 'desc' as const };
    
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        where: { status: 'PUBLISHED' },
        orderBy,
        include: { author: { select: { id: true, nickname: true, avatar: true } } },
      }),
      this.prisma.post.count({ where: { status: 'PUBLISHED' } }),
    ]);
    
    return { items, total, page, limit };
  }

  async findOne(id: number) {
    await this.prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });
    return this.prisma.post.findUnique({
      where: { id },
      include: { 
        author: { select: { id: true, nickname: true, avatar: true, rank: true } },
        comments: { include: { author: { select: { id: true, nickname: true, avatar: true } } } },
      },
    });
  }

  async like(postId: number, userId: number) {
    await this.prisma.postLike.create({ data: { postId, userId } });
    await this.prisma.post.update({ where: { id: postId }, data: { likes: { increment: 1 } } });
  }

  async unlike(postId: number, userId: number) {
    await this.prisma.postLike.delete({ where: { postId_userId: { postId, userId } } });
    await this.prisma.post.update({ where: { id: postId }, data: { likes: { decrement: 1 } } });
  }

  async delete(id: number, userId: number) {
    return this.prisma.post.update({ where: { id, userId }, data: { status: 'DELETED' } });
  }
}
