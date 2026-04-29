# Windows 一键安装指南

## 🚀 方式 1：自动安装（推荐）

### 步骤 1：以管理员身份运行安装脚本

1. 右键点击 `install.bat`
2. 选择"以管理员身份运行"
3. 等待安装完成（约 5-10 分钟）
4. 安装完成后重启电脑

### 步骤 2：启动项目

重启后，双击 `start.bat` 即可启动项目。

---

## 🔧 方式 2：手动安装

### 1. 安装 Docker Desktop

**下载地址：** https://www.docker.com/products/docker-desktop

1. 下载 Docker Desktop for Windows
2. 双击安装包
3. 按照提示完成安装
4. 重启电脑

### 2. 启动 Docker Desktop

1. 打开 Docker Desktop
2. 等待启动完成（右下角图标变绿）

### 3. 启动项目

双击 `start.bat` 启动项目。

---

## 📍 访问地址

启动成功后访问：
- **前端：** http://localhost:3001
- **后端：** http://localhost:3000
- **API 文档：** http://localhost:3000/api/docs

---

## 🧪 测试账号

- **邮箱：** test@example.com
- **密码：** test123

---

## ❓ 常见问题

### Q1: install.bat 提示"请以管理员身份运行"
**A:** 右键点击 install.bat，选择"以管理员身份运行"

### Q2: 安装失败
**A:** 手动下载安装 Docker Desktop：https://www.docker.com/products/docker-desktop

### Q3: start.bat 提示"Docker 未运行"
**A:** 打开 Docker Desktop，等待启动完成

### Q4: 端口被占用
**A:** 
```bash
# 检查端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 杀死进程
taskkill /PID <进程ID> /F
```

---

## 🆘 获取帮助

如有问题，请查看：
- [完整安装指南](INSTALL_GUIDE.md)
- [项目文档](README.md)
