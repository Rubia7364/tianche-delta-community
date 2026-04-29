import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(postId: number, userId: number, content: string, parentId?: number) {
    const comment = await this.prisma.comment.create({
      data: { postId, userId, content, parentId },
      include: { author: { select: { id: true, nickname: true, avatar: true } } },
    });
    await this.prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });
    return comment;
  }

  async findByPost(postId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId, parentId: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, nickname: true, avatar: true } } },
      }),
      this.prisma.comment.count({ where: { postId, parentId: null } }),
    ]);
    return { items, total, page, limit };
  }

  async delete(id: number, userId: number) {
    return this.prisma.comment.delete({ where: { id, userId } });
  }
}
