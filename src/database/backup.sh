#!/bin/bash

# 天策三角洲社区 - 数据库备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME=${DB_NAME:-tianche_delta}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "🔄 开始备份数据库: $DB_NAME"
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_${DATE}.sql

if [ $? -eq 0 ]; then
    echo "✅ 备份成功: $BACKUP_DIR/backup_${DATE}.sql"
    
    # 压缩备份文件
    gzip $BACKUP_DIR/backup_${DATE}.sql
    echo "✅ 压缩完成: $BACKUP_DIR/backup_${DATE}.sql.gz"
    
    # 删除 30 天前的备份
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
    echo "🗑️  已清理 30 天前的备份"
else
    echo "❌ 备份失败"
    exit 1
fi
