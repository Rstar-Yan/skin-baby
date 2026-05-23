#!/bin/bash
#
# 肤小宝 uni-app 微信小程序编译脚本
# 用法: bash deploy/build.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== 肤小宝 uni-app 编译开始 ==="
echo "项目目录: $PROJECT_DIR"

cd "$PROJECT_DIR"

# 检查 node_modules
if [ ! -d "node_modules" ]; then
  echo "[1/2] 安装依赖..."
  npm install
else
  echo "[1/2] 依赖已安装，跳过"
fi

echo "[2/2] 编译微信小程序..."
npm run build:mp-weixin

DIST_DIR="$PROJECT_DIR/dist/build/mp-weixin"
if [ -d "$DIST_DIR" ]; then
  echo "=== 编译完成 ==="
  echo "输出目录: $DIST_DIR"
  echo "文件数量: $(find "$DIST_DIR" -type f | wc -l | tr -d ' ')"
else
  echo "错误: 编译输出目录不存在"
  exit 1
fi