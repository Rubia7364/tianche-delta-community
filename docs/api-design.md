# 天策三角洲社区 - API 设计

## 基础信息

- **Base URL**: `https://api.tianche-delta.com`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

## 通用响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "errors": []
}
```

## 错误码定义

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

---

## 认证相关 API

### 1. 用户注册

**POST** `/api/auth/register`

**请求参数：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "玩家昵称"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "玩家昵称"
  }
}
```

---

### 2. 用户登录

**POST** `/api/auth/login`

**请求参数：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nickname": "玩家昵称",
      "avatar": "https://...",
      "role": "USER"
    }
  }
}
```

---

### 3. 获取当前用户信息

**GET** `/api/auth/me`

**Headers**: `Authorization: Bearer {token}`

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "玩家昵称",
    "avatar": "https://...",
    "game_id": "Player#1234",
    "rank": "钻石",
    "role": "USER"
  }
}
```

---

## 用户相关 API

### 4. 更新用户资料

**PUT** `/api/users/profile`

**Headers**: `Authorization: Bearer {token}`

**请求参数：**
```json
{
  "nickname": "新昵称",
  "avatar": "https://...",
  "game_id": "Player#1234",
  "rank": "钻石",
  "bio": "个人简介"
}
```

---

### 5. 获取用户详情

**GET** `/api/users/:id`

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "nickname": "玩家昵称",
    "avatar": "https://...",
    "game_id": "Player#1234",
    "rank": "钻石",
    "bio": "个人简介",
    "posts_count": 10,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 帖子相关 API

### 6. 发布帖子

**POST** `/api/posts`

**Headers**: `Authorization: Bearer {token}`

**请求参数：**
```json
{
  "title": "帖子标题",
  "content": "帖子内容",
  "images": ["https://...", "https://..."],
  "tags": "攻略,技巧"
}
```

---

### 7. 获取帖子列表

**GET** `/api/posts`

**Query 参数：**
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）
- `sort`: 排序方式（latest/hot）
- `tag`: 标签筛选

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "帖子标题",
        "content": "帖子内容摘要...",
        "images": ["https://..."],
        "tags": "攻略,技巧",
        "views": 100,
        "likes": 10,
        "comments_count": 5,
        "author": {
          "id": 1,
          "nickname": "玩家昵称",
          "avatar": "https://..."
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

### 8. 获取帖子详情

**GET** `/api/posts/:id`

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "帖子标题",
    "content": "完整帖子内容",
    "images": ["https://..."],
    "tags": "攻略,技巧",
    "views": 100,
    "likes": 10,
    "comments_count": 5,
    "is_liked": false,
    "author": {
      "id": 1,
      "nickname": "玩家昵称",
      "avatar": "https://...",
      "rank": "钻石"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 9. 点赞帖子

**POST** `/api/posts/:id/like`

**Headers**: `Authorization: Bearer {token}`

---

### 10. 取消点赞

**DELETE** `/api/posts/:id/like`

**Headers**: `Authorization: Bearer {token}`

---

### 11. 删除帖子

**DELETE** `/api/posts/:id`

**Headers**: `Authorization: Bearer {token}`

---

## 评论相关 API

### 12. 发表评论

**POST** `/api/posts/:id/comments`

**Headers**: `Authorization: Bearer {token}`

**请求参数：**
```json
{
  "content": "评论内容",
  "parent_id": null
}
```

---

### 13. 获取评论列表

**GET** `/api/posts/:id/comments`

**Query 参数：**
- `page`: 页码
- `limit`: 每页数量

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "content": "评论内容",
        "author": {
          "id": 1,
          "nickname": "玩家昵称",
          "avatar": "https://..."
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 50
  }
}
```

---

## 组队相关 API

### 14. 发布组队

**POST** `/api/teams`

**Headers**: `Authorization: Bearer {token}`

**请求参数：**
```json
{
  "title": "钻石排位缺1",
  "mode": "排位赛",
  "map": "城市战",
  "rank_requirement": "钻石+",
  "max_members": 5
}
```

---

### 15. 获取组队列表

**GET** `/api/teams`

**Query 参数：**
- `page`: 页码
- `limit`: 每页数量
- `mode`: 模式筛选
- `rank`: 段位筛选
- `status`: 状态筛选（OPEN/FULL/CLOSED）

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "钻石排位缺1",
        "mode": "排位赛",
        "map": "城市战",
        "rank_requirement": "钻石+",
        "max_members": 5,
        "current_members": 4,
        "status": "OPEN",
        "creator": {
          "id": 1,
          "nickname": "玩家昵称",
          "avatar": "https://...",
          "rank": "钻石"
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 50
  }
}
```

---

### 16. 加入队伍

**POST** `/api/teams/:id/join`

**Headers**: `Authorization: Bearer {token}`

---

### 17. 离开队伍

**POST** `/api/teams/:id/leave`

**Headers**: `Authorization: Bearer {token}`

---

### 18. 解散队伍

**DELETE** `/api/teams/:id`

**Headers**: `Authorization: Bearer {token}`

---

## 私信相关 API

### 19. 发送私信

**POST** `/api/messages`

**Headers**: `Authorization: Bearer {token}`

**请求参数：**
```json
{
  "receiver_id": 2,
  "content": "消息内容"
}
```

---

### 20. 获取私信列表

**GET** `/api/messages`

**Headers**: `Authorization: Bearer {token}`

**Query 参数：**
- `page`: 页码
- `limit`: 每页数量

---

### 21. 标记已读

**PUT** `/api/messages/:id/read`

**Headers**: `Authorization: Bearer {token}`

---

## 埋点相关 API

### 22. 上报埋点事件

**POST** `/api/analytics/track`

**请求参数：**
```json
{
  "event": "page_view",
  "properties": {
    "path": "/posts/123",
    "referrer": "/"
  },
  "timestamp": 1234567890
}
```

---

## 限流规则

| 接口 | 限流规则 |
|-----|---------|
| 登录 | 5 次/分钟 |
| 注册 | 3 次/分钟 |
| 发帖 | 10 次/小时 |
| 评论 | 30 次/小时 |
| 点赞 | 100 次/小时 |
| 其他 | 100 次/分钟 |
