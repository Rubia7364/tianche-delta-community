-- 天策三角洲社区 - 索引优化 SQL

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_rank ON users(rank);

-- 帖子表索引
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_likes ON posts(likes DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_hot ON posts(likes DESC, created_at DESC);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 帖子点赞表索引
CREATE UNIQUE INDEX idx_post_likes_unique ON post_likes(post_id, user_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- 组队表索引
CREATE INDEX idx_teams_creator_id ON teams(creator_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);
CREATE INDEX idx_teams_filter ON teams(status, mode, created_at DESC);

-- 队伍成员表索引
CREATE UNIQUE INDEX idx_team_members_unique ON team_members(team_id, user_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- 私信表索引
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read, created_at DESC);

-- 订单表索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_booster_id ON orders(booster_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
