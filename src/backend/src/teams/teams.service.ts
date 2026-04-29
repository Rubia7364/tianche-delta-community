import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(creatorId: number, data: any) {
    const team = await this.prisma.team.create({
      data: { ...data, creatorId },
      include: { creator: { select: { id: true, nickname: true, avatar: true, rank: true } } },
    });
    await this.prisma.teamMember.create({ data: { teamId: team.id, userId: creatorId } });
    return team;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.team.findMany({
        skip,
        take: limit,
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { id: true, nickname: true, avatar: true, rank: true } } },
      }),
      this.prisma.team.count({ where: { status: 'OPEN' } }),
    ]);
    return { items, total, page, limit };
  }

  async join(teamId: number, userId: number) {
    await this.prisma.teamMember.create({ data: { teamId, userId } });
    const team = await this.prisma.team.update({
      where: { id: teamId },
      data: { currentMembers: { increment: 1 } },
    });
    if (team.currentMembers >= team.maxMembers) {
      await this.prisma.team.update({ where: { id: teamId }, data: { status: 'FULL' } });
    }
  }

  async leave(teamId: number, userId: number) {
    await this.prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId } } });
    await this.prisma.team.update({
      where: { id: teamId },
      data: { currentMembers: { decrement: 1 }, status: 'OPEN' },
    });
  }

  async delete(id: number, userId: number) {
    return this.prisma.team.update({ where: { id, creatorId: userId }, data: { status: 'CLOSED' } });
  }
}
