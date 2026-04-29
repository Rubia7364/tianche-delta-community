# 天策三角洲社区 - 安装指南

## 📦 项目地址

**GitHub：** https://github.com/Rubia7364/tianche-delta-community

---

## 🚀 快速开始（3 种方式）

### 方式 1：Docker 一键启动（推荐，最简单）

#### 前置要求
- Docker
- Docker Compose

#### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/Rubia7364/tianche-delta-community.git
cd tianche-delta-community

# 2. 一键启动
./start.sh

# 3. 等待启动完成（约 2-3 分钟）
# 启动完成后访问：
# 前端：http://localhost:3001
# 后端：http://localhost:3000
# API 文档：http://localhost:3000/api/docs
```

**测试账号：**
- 邮箱：test@example.com
- 密码：test123

---

### 方式 2：本地开发启动（推荐开发者）

#### 前置要求
- Node.js 18+
- MySQL 8.0
- Redis 7.0（可选）
- npm 或 yarn

#### 安装步骤

##### 1. 克隆项目
```bash
git clone https://github.com/Rubia7364/tianche-delta-community.git
cd tianche-delta-community
```

##### 2. 安装 MySQL 和 Redis

**macOS：**
```bash
brew install mysql redis
brew services start mysql
brew services start redis
```

**Ubuntu/Debian：**
```bash
sudo apt update
sudo apt install mysql-server redis-server
sudo systemctl start mysql
sudo systemctl start redis
```

**Windows：**
- MySQL：https://dev.mysql.com/downloads/installer/
- Redis：https://github.com/microsoftarchive/redis/releases

##### 3. 创建数据库
```bash
mysql -u root -p
# 输入密码后执行：
CREATE DATABASE tianche_delta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

##### 4. 初始化数据库
```bash
cd src/database/prisma

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 导入种子数据
npx ts-node seed.ts
```

##### 5. 启动后端
```bash
cd ../../backend

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env

# 编辑 .env 文件，修改数据库连接信息
# DATABASE_URL="mysql://root:你的密码@localhost:3306/tianche_delta"
# JWT_SECRET="your-secret-key"

# 启动开发服务器
npm run start:dev

# 后端运行在 http://localhost:3000
```

##### 6. 启动前端（新终端）
```bash
cd tianche-delta-community/src/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端运行在 http://localhost:3001
```

---

### 方式 3：生产环境部署

#### 使用 Docker Compose（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Rubia7364/tianche-delta-community.git
cd tianche-delta-community

# 2. 修改环境变量
# 编辑 docker-compose.yml，修改密码和密钥

# 3. 启动生产环境
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down
```

---

## 📍 访问地址

启动成功后，访问以下地址：

- **前端首页：** http://localhost:3001
- **登录页面：** http://localhost:3001/login
- **注册页面：** http://localhost:3001/register
- **组队大厅：** http://localhost:3001/teams
- **后端 API：** http://localhost:3000
- **API 文档：** http://localhost:3000/api/docs

---

## 🧪 测试账号

### 管理员账号
- 邮箱：admin@tianche-delta.com
- 密码：admin123
- 角色：ADMIN

### 测试用户
- 邮箱：test@example.com
- 密码：test123
- 角色：USER

---

## 🔧 常见问题

### 1. 数据库连接失败

**问题：** `Error: Can't reach database server`

**解决：**
```bash
# 检查 MySQL 是否运行
# macOS/Linux
brew services list  # 或 systemctl status mysql

# 检查连接
mysql -u root -p -e "SELECT 1"

# 检查数据库是否存在
mysql -u root -p -e "SHOW DATABASES LIKE 'tianche_delta'"
```

### 2. 端口被占用

**问题：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决：**
```bash
# 查看端口占用
lsof -i :3000
lsof -i :3001

# 杀死进程
kill -9 <PID>

# 或修改端口
# 后端：修改 src/backend/src/main.ts 中的端口
# 前端：修改 src/frontend/package.json 中的 dev 脚本
```

### 3. Prisma Client 未生成

**问题：** `Cannot find module '@prisma/client'`

**解决：**
```bash
cd src/database/prisma
npx prisma generate
```

### 4. 依赖安装失败

**问题：** `npm install` 失败

**解决：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用 yarn
yarn install
```

### 5. Docker 启动失败

**问题：** Docker 容器启动失败

**解决：**
```bash
# 查看日志
docker-compose logs

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 检查容器状态
docker-compose ps
```

---

## 📚 项目结构

```
tianche-delta-community/
├── README.md                    # 项目说明
├── INSTALL_GUIDE.md            # 安装指南（本文件）
├── docker-compose.yml          # Docker 配置
├── start.sh                    # 一键启动脚本
├── docs/                       # 设计文档
│   ├── architecture.md         # 架构设计
│   ├── database-schema.md      # 数据库设计
│   └── api-design.md           # API 设计
├── src/
│   ├── backend/                # 后端（NestJS）
│   │   ├── src/
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── users/         # 用户模块
│   │   │   ├── posts/         # 帖子模块
│   │   │   ├── teams/         # 组队模块
│   │   │   └── comments/      # 评论模块
│   │   └── package.json
│   ├── frontend/               # 前端（Next.js）
│   │   ├── app/
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── login/         # 登录页
│   │   │   ├── register/      # 注册页
│   │   │   └── teams/         # 组队大厅
│   │   └── package.json
│   └── database/               # 数据库
│       └── prisma/
│           ├── schema.prisma   # 数据库模型
│           └── seed.ts         # 种子数据
```

---

## 🎯 功能清单

### ✅ 已实现
- ✅ 用户注册/登录（JWT 认证）
- ✅ 帖子发布/查看/点赞
- ✅ 评论发表/查看/删除
- ✅ 组队发布/加入/离开
- ✅ 网站导航

### ⏳ 待实现
- ⏳ 帖子详情页
- ⏳ 发帖页面
- ⏳ 私信功能
- ⏳ 个人主页
- ⏳ 管理后台

---

## 📖 开发文档

- **项目总结：** PROJECT_SUMMARY.md
- **完整指南：** COMPLETE_GUIDE.md
- **测试报告：** RETEST_REPORT.md
- **API 设计：** docs/api-design.md
- **数据库设计：** docs/database-schema.md

---

## 🆘 获取帮助

如有问题，请：
1. 查看 [常见问题](#常见问题)
2. 查看项目文档（docs/ 目录）
3. 查看 API 文档（http://localhost:3000/api/docs）
4. 提交 GitHub Issue

---

## 📝 License

MIT

---

**祝你使用愉快！🎉**
