# 安全设计文档

## JWT 认证流程

### Token 生成
```typescript
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role
};
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
```

### Token 验证
- 每个请求携带 Token
- 后端验证 Token 有效性
- 解析用户信息

## RBAC 权限模型

### 角色定义
- **USER**: 普通用户（发帖、评论、组队）
- **MODERATOR**: 版主（删除违规内容、临时封禁）
- **ADMIN**: 管理员（所有权限）

### 权限映射
```typescript
const permissions = {
  USER: ['post:create', 'post:read', 'comment:create'],
  MODERATOR: ['post:delete', 'user:ban'],
  ADMIN: ['*']
};
```

## 数据加密

### 密码加密
```typescript
import * as bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 10);
```

### 敏感数据加密
- 支付信息：AES-256
- 个人隐私：脱敏展示

## API 安全

### 限流策略
- 全局：1000 req/s
- 单 IP：100 req/s
- 登录：5 次/分钟

### SQL 注入防护
- 使用 Prisma ORM
- 参数化查询

### XSS/CSRF 防护
- 输入验证
- 输出转义
- CSRF Token
