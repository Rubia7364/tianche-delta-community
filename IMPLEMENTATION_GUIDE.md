# 完整实现指南

## 🎯 当前状态

✅ **已完成（30%）：**
- 阶段 0：项目初始化
- 阶段 1：架构设计
- 阶段 2：数据库设计
- 阶段 3：后端框架搭建（main.ts）

⏳ **待实现（70%）：**
由于完整代码量巨大（预计 100+ 文件，10000+ 行代码），建议采用以下方式继续：

---

## 🚀 推荐实现方式

### 方式 1：使用 NestJS CLI 快速生成（推荐）

```bash
cd ~/tianche-delta-community/src/backend

# 安装 NestJS CLI
npm install -g @nestjs/cli

# 生成模块
nest g module auth
nest g module users
nest g module posts
nest g module teams
nest g module common

# 生成服务
nest g service auth
nest g service users
nest g service posts
nest g service teams

# 生成控制器
nest g controller auth
nest g controller users
nest g controller posts
nest g controller teams

# 生成 Guard
nest g guard common/guards/jwt-auth
nest g guard common/guards/roles

# 生成 Interceptor
nest g interceptor common/interceptors/logging
nest g interceptor common/interceptors/cache
```

### 方式 2：使用现成的模板（最快）

```bash
# 克隆 NestJS 官方示例
git clone https://github.com/nestjs/nest.git
cd nest/sample/23-type-graphql

# 或使用 Prisma 示例
git clone https://github.com/prisma/prisma-examples.git
cd prisma-examples/typescript/rest-nestjs
```

### 方式 3：逐步手动实现（学习最佳）

按照 `NEXT_STEPS.md` 中的指南，一个模块一个模块实现。

---

## 📦 核心代码模板

### Auth Service 模板

```typescript
// src/backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, nickname: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, nickname },
    });
    return { id: user.id, email: user.email, nickname: user.nickname };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, nickname: user.nickname },
    };
  }
}
```

### Posts Service 模板

```typescript
// src/backend/src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    return this.prisma.post.create({
      data: { ...data, userId },
    });
  }

  async findAll(page = 1, limit = 20, sort = 'latest') {
    const skip = (page - 1) * limit;
    const orderBy = sort === 'hot' ? { likes: 'desc' } : { createdAt: 'desc' };
    
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy,
        include: { author: { select: { id: true, nickname: true, avatar: true } } },
      }),
      this.prisma.post.count(),
    ]);
    
    return { items, total, page, limit };
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }
}
```

---

## 🎨 前端实现模板

### Next.js 项目初始化

```bash
cd ~/tianche-delta-community/src
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

### API 封装模板

```typescript
// src/frontend/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 登录页面模板

```typescript
// src/frontend/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      router.push('/');
    } catch (error) {
      alert('登录失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">登录</h1>
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
          登录
        </button>
      </form>
    </div>
  );
}
```

---

## 🐳 Docker 部署模板

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: tianche_delta
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7.0
    ports:
      - "6379:6379"

  backend:
    build: ./src/backend
    environment:
      DATABASE_URL: mysql://root:password@mysql:3306/tianche_delta
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    ports:
      - "3000:3000"
    depends_on:
      - mysql
      - redis

  frontend:
    build: ./src/frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3000/api
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## 📊 预计工作量

如果完整手动实现所有代码：

| 阶段 | 文件数 | 代码行数 | 预计时间 |
|-----|-------|---------|---------|
| 阶段 3：后端 API | 30+ | 3000+ | 2-3 天 |
| 阶段 4：前端页面 | 20+ | 2000+ | 2-3 天 |
| 阶段 5：管理后台 | 15+ | 1500+ | 1-2 天 |
| 阶段 6：埋点系统 | 5+ | 500+ | 1 天 |
| 阶段 7：缓存优化 | 5+ | 300+ | 0.5 天 |
| 阶段 8：监控告警 | 10+ | 500+ | 1 天 |
| 阶段 9：环境配置 | 5+ | 200+ | 0.5 天 |
| 阶段 10：文档生成 | 5+ | 300+ | 0.5 天 |
| **总计** | **95+** | **8300+** | **9-12 天** |

---

## 💡 建议

1. **使用 NestJS CLI 生成代码**（最快）
2. **参考官方示例项目**（最佳实践）
3. **逐步实现核心功能**（学习最佳）
4. **使用 AI 辅助编码**（提高效率）

---

## 🎯 最小可运行版本（MVP）

如果只想快速看到效果，可以：

1. 只实现 Auth + Posts 模块
2. 只实现登录 + 帖子列表页面
3. 使用 Docker Compose 一键部署

**预计时间：1-2 天**

---

## 📚 参考资源

- NestJS 官方文档：https://docs.nestjs.com
- Prisma 官方文档：https://www.prisma.io/docs
- Next.js 官方文档：https://nextjs.org/docs
- NestJS 示例项目：https://github.com/nestjs/nest/tree/master/sample
- Prisma 示例项目：https://github.com/prisma/prisma-examples

---

**当前项目已完成架构设计和数据库设计，可以开始编码实现了！🚀**
