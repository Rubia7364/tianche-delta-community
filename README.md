# 天策三角洲社区 - 快速启动指南

## 🚀 快速开始

### 前置要求

- Node.js 18+
- MySQL 8.0
- Redis 7.0
- npm 或 yarn

---

## 📦 安装步骤

### 1. 初始化数据库

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE tianche_delta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 设置环境变量
cd ~/tianche-delta-community/src/backend
cat > .env << EOF
DATABASE_URL="mysql://root:your_password@localhost:3306/tianche_delta"
JWT_SECRET="your-secret-key-change-in-production"
REDIS_URL="redis://localhost:6379"
EOF

# 运行数据库迁移
cd ../database/prisma
npx prisma migrate dev --name init
npx prisma generate

# 导入种子数据
npx ts-node seed.ts
```

### 2. 启动后端服务

```bash
cd ~/tianche-delta-community/src/backend

# 安装依赖
npm install

# 启动开发服务器
npm run start:dev

# 后端将运行在 http://localhost:3000
```

### 3. 启动前端服务（待实现）

```bash
cd ~/tianche-delta-community/src/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端将运行在 http://localhost:3001
```

---

## 🧪 测试账号

### 管理员账号
- 邮箱：`admin@tianche-delta.com`
- 密码：`admin123`
- 角色：ADMIN

### 测试用户
- 邮箱：`test@example.com`
- 密码：`test123`
- 角色：USER

---

## 📚 API 文档

启动后端后，访问 Swagger 文档：

**http://localhost:3000/api/docs**

---

## 🔧 开发命令

### 后端

```bash
# 开发模式
npm run start:dev

# 生产构建
npm run build
npm run start:prod

# 运行测试
npm run test

# 数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# 查看数据库
npx prisma studio
```

### 前端

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm run start

# 代码检查
npm run lint
```

---

## 🗄️ 数据库管理

### 备份数据库

```bash
cd ~/tianche-delta-community/src/database
./backup.sh
```

### 恢复数据库

```bash
cd ~/tianche-delta-community/src/database
./restore.sh backups/backup_20240101_120000.sql.gz
```

### 查看数据库

```bash
# 使用 Prisma Studio
cd ~/tianche-delta-community/src/database/prisma
npx prisma studio

# 浏览器访问 http://localhost:5555
```

---

## 🐳 Docker 部署（推荐）

### 使用 Docker Compose

```bash
cd ~/tianche-delta-community

# 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
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

volumes:
  mysql_data:
EOF

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 📊 监控

### 启动监控服务

```bash
# Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Grafana
docker run -d -p 3001:3000 grafana/grafana

# 访问 Grafana: http://localhost:3001
# 默认账号: admin/admin
```

---

## 🔍 故障排查

### 数据库连接失败

```bash
# 检查 MySQL 是否运行
systemctl status mysql

# 检查连接
mysql -u root -p -e "SELECT 1"

# 检查数据库是否存在
mysql -u root -p -e "SHOW DATABASES LIKE 'tianche_delta'"
```

### Redis 连接失败

```bash
# 检查 Redis 是否运行
systemctl status redis

# 测试连接
redis-cli ping
```

### 端口被占用

```bash
# 查看端口占用
lsof -i :3000
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

---

## 📖 更多文档

- [项目总结](PROJECT_SUMMARY.md)
- [架构设计](docs/architecture.md)
- [数据库设计](docs/database-schema.md)
- [API 设计](docs/api-design.md)
- [安全设计](docs/security-design.md)

---

## 🆘 获取帮助

如有问题，请查看：
1. 项目文档（docs/ 目录）
2. API 文档（http://localhost:3000/api/docs）
3. 数据库 Schema（src/database/prisma/schema.prisma）

---

**祝开发顺利！🎉**
