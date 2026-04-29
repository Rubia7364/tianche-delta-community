#!/bin/bash

echo "🚀 启动天策三角洲社区..."

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 启动服务
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 10

# 初始化数据库
echo "📊 初始化数据库..."
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma db seed

echo ""
echo "✅ 启动完成！"
echo ""
echo "📍 访问地址："
echo "   前端：http://localhost:3001"
echo "   后端：http://localhost:3000"
echo "   API 文档：http://localhost:3000/api/docs"
echo ""
echo "🧪 测试账号："
echo "   邮箱：test@example.com"
echo "   密码：test123"
echo ""
echo "📊 查看日志："
echo "   docker-compose logs -f"
echo ""
echo "🛑 停止服务："
echo "   docker-compose down"
