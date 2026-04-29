@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🎮 天策三角洲社区 - Docker 一键启动                  ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到 Docker
    echo.
    echo 请先安装 Docker Desktop：
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM 检查 Docker 是否运行
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：Docker 未运行
    echo.
    echo 请启动 Docker Desktop 后重试
    echo.
    pause
    exit /b 1
)

echo ✅ Docker 检查通过
echo.
echo 🚀 正在启动服务...
echo.

REM 启动 Docker Compose
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo ❌ 启动失败
    echo.
    echo 请检查：
    echo 1. Docker Desktop 是否正常运行
    echo 2. 端口 3000, 3001, 3306, 6379 是否被占用
    echo.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          ✅ 启动成功！正在等待服务就绪...                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⏳ 等待 30 秒让服务完全启动...
timeout /t 30 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🎉 服务已启动！                                      ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 访问地址：
echo    前端：http://localhost:3001
echo    后端：http://localhost:3000
echo    API 文档：http://localhost:3000/api/docs
echo.
echo 🧪 测试账号：
echo    邮箱：test@example.com
echo    密码：test123
echo.
echo 📚 查看日志：docker-compose logs -f
echo 🛑 停止服务：docker-compose down
echo.
echo 正在打开浏览器...
timeout /t 2 /nobreak >nul
start http://localhost:3001
echo.
pause
