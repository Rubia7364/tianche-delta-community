@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🎮 天策三角洲社区 - 一键安装脚本                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 检查是否以管理员身份运行
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    echo.
    echo 右键点击 install.bat，选择"以管理员身份运行"
    echo.
    pause
    exit /b 1
)

echo ✅ 管理员权限检查通过
echo.

REM 检查 winget 是否可用
winget --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 winget（Windows 包管理器）
    echo.
    echo 请手动安装 Docker Desktop：
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ winget 检查通过
echo.

REM 检查 Docker 是否已安装
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker 已安装
    echo.
    goto :check_docker_running
)

echo 📦 正在安装 Docker Desktop...
echo.
echo ⏳ 这可能需要几分钟，请耐心等待...
echo.

winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements

if %errorlevel% neq 0 (
    echo.
    echo ❌ 自动安装失败
    echo.
    echo 请手动安装 Docker Desktop：
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Docker Desktop 安装完成
echo.
echo ⚠️ 请重启电脑后再运行 start.bat
echo.
pause
exit /b 0

:check_docker_running
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker 正在运行
    echo.
    echo 🎉 环境已就绪！
    echo.
    echo 📝 下一步：
    echo    双击 start.bat 启动项目
    echo.
    pause
    exit /b 0
)

echo ⚠️ Docker 已安装但未运行
echo.
echo 📝 请手动启动 Docker Desktop，然后运行 start.bat
echo.
pause
exit /b 0
