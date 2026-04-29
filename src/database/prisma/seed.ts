import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据...');

  // 创建管理员账号
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tianche-delta.com' },
    update: {},
    create: {
      email: 'admin@tianche-delta.com',
      password: adminPassword,
      nickname: '管理员',
      role: 'ADMIN',
      bio: '天策三角洲社区管理员',
    },
  });
  console.log('✅ 管理员账号创建成功:', admin.email);

  // 创建测试用户
  const testPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: testPassword,
      nickname: '测试玩家',
      gameId: 'TestPlayer#1234',
      rank: '钻石',
      role: 'USER',
      bio: '这是一个测试账号',
    },
  });
  console.log('✅ 测试用户创建成功:', testUser.email);

  // 创建示例帖子
  const post = await prisma.post.create({
    data: {
      userId: testUser.id,
      title: '欢迎来到天策三角洲社区！',
      content: '这是第一篇帖子，欢迎大家加入我们的社区！在这里你可以找队友、分享攻略、交流心得。',
      tags: '公告,欢迎',
      views: 100,
      likes: 10,
    },
  });
  console.log('✅ 示例帖子创建成功:', post.title);

  // 创建示例组队
  const team = await prisma.team.create({
    data: {
      creatorId: testUser.id,
      title: '钻石排位缺1',
      mode: '排位赛',
      map: '城市战',
      rankRequirement: '钻石+',
      maxMembers: 5,
      currentMembers: 4,
      status: 'OPEN',
    },
  });
  console.log('✅ 示例组队创建成功:', team.title);

  console.log('🎉 种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
