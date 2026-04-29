# 天策三角洲社区 - 项目结构

## 📁 目录结构

```
tianche-delta-community/
├── docs/                           # 设计文档
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-design.md
│   └── ...
├── src/
│   ├── backend/                    # 后端（NestJS）
│   │   ├── prisma/                 # Prisma 配置（从 database 复制）
│   │   │   ├── schema.prisma
│   │   │   └── .env
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/               # 认证模块
│   │   │   ├── users/              # 用户模块
│   │   │   ├── posts/              # 帖子模块
│   │   │   ├── teams/              # 组队模块
│   │   │   ├── comments/           # 评论模块
│   │   │   └── prisma/             # Prisma 服务
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── .env                    # 本地环境变量（不提交）
│   ├── frontend/                   # 前端（Next.js）
│   │   ├── app/
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── login/              # 登录页
│   │   │   ├── register/           # 注册页
│   │   │   ├── teams/              # 组队大厅
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── lib/
│   │   │   └── api.ts              # API 封装
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── .env.local              # 本地环境变量（不提交）
│   └── database/                   # 数据库（主数据源）
│       └── prisma/
│           ├── schema.prisma       # 主 schema 文件
│           ├── seed.ts             # 种子数据
│           ├── .env                # 数据库连接
│           └── package.json
├── docker-compose.yml
├── start.sh                        # Linux/macOS 启动脚本
├── start.bat                       # Windows 启动脚本
├── install.bat                     # Windows 安装脚本
├── README.md
└── .gitignore

## 🔧 关键配置

### 后端 Prisma 配置

后端的 `prisma/` 目录是从 `src/database/prisma/` 复制过来的：
- `schema.prisma` - 数据库模型
- `.env` - 数据库连接字符串

### 环境变量

**后端 (.env):**
```
DATABASE_URL="mysql://root:password@localhost:3306/tianche_delta"
JWT_SECRET="your-secret-key"
PORT=3000
```

**前端 (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 启动流程

### 1. 初始化数据库（只需一次）
```bash
cd src/database/prisma
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node seed.ts
```

### 2. 设置后端
```bash
cd src/backend
mkdir -p prisma
cp ../database/prisma/schema.prisma prisma/
cp ../database/prisma/.env prisma/
npm install
npx prisma generate
```

### 3. 启动后端
```bash
cd src/backend
npm run start:dev
```

### 4. 启动前端
```bash
cd src/frontend
npm install
npm run dev
```

## 📝 注意事项

1. **Prisma Schema 同步**
   - 主 schema 在 `src/database/prisma/schema.prisma`
   - 修改后需要复制到 `src/backend/prisma/schema.prisma`

2. **环境变量**
   - 不要提交 `.env` 文件到 Git
   - 使用 `.env.example` 作为模板

3. **数据库迁移**
   - 在 `src/database/prisma/` 目录执行
   - 迁移后需要在后端重新生成 Prisma Client
