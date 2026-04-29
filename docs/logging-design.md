# 日志设计文档

## 日志级别
- ERROR: 错误日志
- WARN: 警告日志
- INFO: 信息日志
- DEBUG: 调试日志（仅开发环境）

## 日志格式
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "request_id": "uuid",
  "user_id": 1,
  "method": "GET",
  "path": "/api/posts",
  "status": 200,
  "duration": 50,
  "message": "Request completed"
}
```

## 日志类型

### 应用日志
- 请求日志
- 错误日志
- 业务日志

### 访问日志
- Nginx 访问日志
- API 访问日志

### 审计日志
- 用户登录/登出
- 权限变更
- 敏感操作

## 日志保留
- 应用日志: 7 天
- 访问日志: 30 天
- 审计日志: 180 天
