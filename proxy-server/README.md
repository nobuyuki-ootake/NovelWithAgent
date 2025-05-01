# AIプロキシサーバー for ノベル作成エージェント

このプロキシサーバーは、ノベル作成エージェントアプリケーションのバックエンドとして機能し、APIキー管理、ユーザー認証、APIプロキシなどの機能を提供します。

## 機能

- **APIプロキシ**: OpenAI, Claude, Gemini APIへの安全なアクセス
- **API キー管理**: ユーザーごとのAPIキーの暗号化保存と管理
- **ユーザー認証**: JWT認証によるセキュアなアクセス制御
- **レート制限**: 過剰なAPIリクエストの防止
- **キャッシュ**: Redis によるレスポンスキャッシュ

## 技術スタック

- **フレームワーク**: NestJS (Express 上に構築)
- **データベース**: PostgreSQL (TypeORM による ORM)
- **キャッシュ**: Redis
- **認証**: JWT, Passport
- **暗号化**: AES-256-GCM
- **ドキュメント**: Swagger UI

## 開発環境のセットアップ

### 前提条件

- Node.js (v16以上)
- yarn または npm
- PostgreSQL
- Redis (オプション)

### インストール

1. リポジトリをクローン:

```bash
git clone <repository-url>
cd proxy-server
```

2. 依存関係をインストール:

```bash
npm install
```

3. 環境変数の設定:

```bash
# .envファイルをコピー
cp .env.example .env

# 環境変数を編集
nano .env  # または任意のエディタ
```

4. 暗号化キーの生成:

```bash
# 暗号化キー生成スクリプトを作成
nano scripts/generate-encryption-key.ts

# 暗号化キーを生成
npx ts-node scripts/generate-encryption-key.ts
```

出力された暗号化キーを`.env`ファイルの`ENCRYPTION_KEY`に設定します。

5. PostgreSQLデータベースの作成:

```bash
createdb novel_agent  # PostgreSQLコマンドラインツール
```

6. データベースマイグレーションの実行:

```bash
npm run migration:run
```

7. (オプション) 開発用シードデータの追加:

```bash
npm run db:seed
```

## 実行

開発サーバーの起動:

```bash
npm run start:dev
```

本番サーバーのビルドと起動:

```bash
npm run build
npm run start:prod
```

## API ドキュメント

Swagger UI ドキュメントは開発環境で自動的に生成され、以下のURLでアクセスできます:

http://localhost:4001/api-docs

## API エンドポイント

### 認証

- `POST /auth/login` - ユーザーログイン
- `POST /users/register` - ユーザー登録

### ユーザー管理

- `GET /users/profile` - ユーザープロフィール取得
- `PUT /users/profile` - ユーザープロフィール更新
- `DELETE /users/profile` - ユーザーアカウント削除

### API キー管理

- `GET /api-keys` - APIキー一覧取得
- `POST /api-keys` - APIキーの追加
- `DELETE /api-keys/:id` - APIキーの削除

### AI プロキシ

- `POST /ai-proxy/openai` - OpenAI API リクエスト
- `POST /ai-proxy/claude` - Claude API リクエスト
- `POST /ai-proxy/gemini` - Gemini API リクエスト

## セキュリティ対策

1. **API キーの暗号化**: すべてのAPI キーはAES-256-GCM で暗号化されて保存
2. **JWT 認証**: すべてのエンドポイントはJWT トークンによる認証が必要
3. **レート制限**: IP アドレスごとのリクエスト数制限
4. **Helmet**: HTTP ヘッダーセキュリティの実装
5. **CORS 設定**: 許可されたオリジンからのリクエストのみ受け付け

## 開発者向け情報

### ディレクトリ構造

```
proxy-server/
├── src/
│   ├── ai-proxy/      # AIプロキシ機能
│   ├── api-keys/      # APIキー管理
│   ├── auth/          # 認証機能
│   ├── db/            # データベース関連
│   ├── users/         # ユーザー管理
│   ├── utils/         # ユーティリティ関数
│   ├── app.module.ts  # アプリケーションモジュール
│   └── main.ts        # アプリケーションエントリーポイント
├── scripts/           # 開発用スクリプト
├── tests/             # テストファイル
└── .env.example       # 環境変数サンプル
```

### デバッグ

デバッグモードでの実行:

```bash
npm run start:debug
```

### テスト

単体テストの実行:

```bash
npm run test
```

E2Eテストの実行:

```bash
npm run test:e2e
```

## ライセンス

ISC
