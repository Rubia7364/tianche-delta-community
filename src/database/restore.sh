#!/bin/bash

# 天策三角洲社区 - 数据库恢复脚本

BACKUP_FILE=$1
DB_NAME=${DB_NAME:-tianche_delta}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ 用法: ./restore.sh <backup_file>"
    echo "示例: ./restore.sh backups/backup_20240101_120000.sql.gz"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ 备份文件不存在: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  警告: 此操作将覆盖当前数据库！"
read -p "确认恢复？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ 已取消恢复"
    exit 0
fi

echo "🔄 开始恢复数据库: $DB_NAME"

# 如果是压缩文件，先解压
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME
else
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE
fi

if [ $? -eq 0 ]; then
    echo "✅ 恢复成功"
else
    echo "❌ 恢复失败"
    exit 1
fi
