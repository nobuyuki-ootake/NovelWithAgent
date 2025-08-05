FROM node:18-alpine

WORKDIR /app

# pnpm をインストール
RUN npm install -g pnpm

# package.json ファイルをコピー
COPY package.json pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY apps/proxy-server/package.json ./apps/proxy-server/

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# types パッケージをビルド
RUN cd packages/types && pnpm run build

# proxy-server をビルド
RUN cd apps/proxy-server && pnpm run build

# ポート設定
EXPOSE 5000

# アプリケーション実行
CMD ["node", "apps/proxy-server/dist/index.js"]