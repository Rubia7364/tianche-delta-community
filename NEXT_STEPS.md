# 下一步开发指南

## 🎯 当前状态

✅ **已完成：**
- 阶段 0：项目初始化
- 阶段 1：架构设计
- 阶段 2：数据库设计

⏳ **待完成：**
- 阶段 3：后端 API 实现
- 阶段 4：前端实现
- 阶段 5：管理后台
- 阶段 6：埋点系统
- 阶段 7：缓存优化
- 阶段 8：监控告警
- 阶段 9：环境配置
- 阶段 10：文档生成

---

## 📋 立即可做的事情

### 1. 实现后端核心模块（优先级：高）

#### Auth 模块（认证）
```typescript
// src/backend/src/auth/auth.service.ts
- 实现用户注册
- 实现用户登录
- 实现 JWT 生成和验证
- 实现密码加密
```

#### Users 模块（用户）
```typescript
// src/backend/src/users/users.service.ts
- 实现获取用户信息
- 实现更新用户资料
- 实现用户列表查询
```

#### Posts 模块（帖子）
```typescript
// src/backend/src/posts/posts.service.ts
- 实现发布帖子
- 实现帖子列表（分页、排序）
- 实现帖子详情
- 实现点赞/取消点赞
- 实现删除帖子
```

#### Teams 模块（组队）
```typescript
// src/backend/src/teams/teams.service.ts
- 实现发布组队
- 实现组队列表（筛选）
- 实现加入/离开队伍
- 实现解散队伍
```

### 2. 实现前端页面（优先级：高）

#### 初始化 Next.js 项目
```bash
cd ~/tianche-delta-community/src
npx create-next-app@latest frontend --typescript --tailwind --app
```

#### 核心页面
- `/login` - 登录页面
- `/register` - 注册页面
- `/` - 首页（帖子广场）
- `/posts/[id]` - 帖子详情
- `/teams` - 组队大厅
- `/profile` - 个人主页

### 3. 实现管理后台（优先级：中）

```bash
cd ~/tianche-delta-community/src
npx create-react-app admin --template typescript
```

#### 核心功能
- 用户管理（列表、封禁）
- 帖子管理（审核、删除）
- 数据统计（图表）

---

## 🔧 技术实现建议

### 后端开发

#### 1. 创建 Prisma Service
```typescript
// src/backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

#### 2. 创建 JWT Strategy
```typescript
// src/backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

#### 3. 创建 Auth Guard
```typescript
// src/backend/src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### 4. 创建 Roles Guard
```typescript
// src/backend/src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### 前端开发

#### 1. 创建 API 封装
```typescript
// src/frontend/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### 2. 创建认证 Hook
```typescript
// src/frontend/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

---

## 📊 开发优先级

### 第一周
- [ ] 实现 Auth 模块（注册、登录）
- [ ] 实现 Users 模块（用户信息）
- [ ] 实现前端登录/注册页面
- [ ] 实现前端首页框架

### 第二周
- [ ] 实现 Posts 模块（发帖、列表、详情）
- [ ] 实现前端帖子广场
- [ ] 实现前端帖子详情页
- [ ] 实现评论功能

### 第三周
- [ ] 实现 Teams 模块（组队功能）
- [ ] 实现前端组队大厅
- [ ] 实现私信功能
- [ ] 集成 Redis 缓存

### 第四周
- [ ] 实现管理后台
- [ ] 实现埋点系统
- [ ] 配置监控告警
- [ ] 部署测试环境

---

## 🚀 快速启动开发

### 1. 启动数据库
```bash
# MySQL
systemctl start mysql

# Redis
systemctl start redis
```

### 2. 初始化数据库
```bash
cd ~/tianche-delta-community/src/database/prisma
npx prisma migrate dev --name init
npx prisma generate
npx ts-node seed.ts
```

### 3. 启动后端
```bash
cd ~/tianche-delta-community/src/backend
npm install
npm run start:dev
```

### 4. 启动前端（创建后）
```bash
cd ~/tianche-delta-community/src/frontend
npm install
npm run dev
```

---

## 📚 参考资料

### 官方文档
- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs

### 学习资源
- NestJS 中文文档: https://nestjs.bootcss.com
- Next.js 中文文档: https://nextjs.cn
- Prisma 中文文档: https://prisma.yoga

---

## 💡 开发建议

1. **先实现核心功能**：认证 → 帖子 → 组队
2. **边开发边测试**：使用 Postman 测试 API
3. **及时提交代码**：每完成一个功能就提交
4. **遵循代码规范**：使用 ESLint + Prettier
5. **写好注释**：关键逻辑必须注释
6. **单元测试**：核心业务逻辑要有测试

---

**开始编码吧！🚀**
