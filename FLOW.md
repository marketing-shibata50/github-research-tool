# GitHub Development Flow Guide

このガイドは、Git worktreeを活用した効率的な開発フローをまとめたものです。

## 📋 基本的な開発フロー

### 1. 新規開発の流れ

#### 計画フェーズ
1. **リポジトリの作成**: GitHub上でプロジェクト用のリポジトリを作成
2. **ブランチ戦略の決定**:
   - `main`: リリース可能な安定版
   - `develop`: 開発統合用ブランチ
3. **仕様書の作成**: README.mdに「何を」「なぜ」「誰のために」を記載
4. **タスクの洗い出しと分解**: 数時間〜1日で完了できるレベルまで細分化
5. **全タスクのIssue化**: GitHub Issuesに登録し、Projectsボードで管理

#### 開発フェーズ
```bash
# 1. Issueの選択
# GitHub ProjectsでIssueを「進行中」に移動

# 2. worktreeでブランチ作成
git worktree add -b feature/11-login-ui ../login-ui-work develop
cd ../login-ui-work

# 3. 開発作業
# コーディング作業

# 4. コミット (Conventional Commits形式)
git add .
git commit -m "feat: ログインフォームのUIコンポーネントを作成 #11"

# 5. プッシュ
git push origin feature/11-login-ui
```

#### レビュー＆統合フェーズ
1. **プルリクエストの作成**: GitHub上でPRを作成（`Closes #11`を含める）
2. **自動テストの実行**: GitHub Actionsが自動でテストを実行
3. **コードレビュー**: レビュアーがコードを確認
4. **マージ**: テストとレビューが完了したらマージ
5. **後片付け**:
   ```bash
   cd ../my-project
   git worktree remove ../login-ui-work
   git branch -d feature/11-login-ui
   git push origin --delete feature/11-login-ui
   ```

### 2. 機能追加の流れ

#### 計画フェーズ
1. **機能要件の明確化**: What（何を）、Why（なぜ）、How（どのように）を定義
2. **Issueの作成**: 要件、技術的検討事項、受け入れ条件を記載
3. **ラベルとプロジェクトボードへの追加**: `feature`ラベル、優先度設定
4. **タスクの分解**: 大きな機能はサブタスクに分割

#### 開発フェーズ
```bash
# 1. 最新のdevelopを取得
cd ../my-project
git checkout develop
git pull origin develop

# 2. 機能用の作業場を作成
git worktree add -b feature/24-comment ../comment-work develop
cd ../comment-work

# 3. 開発（小さなコミットを重ねる）
git commit -m "feat: コメント投稿フォームのUIを作成 #24"
git commit -m "test: コメント投稿APIのテストを追加 #24"

# 4. 定期的なプッシュ
git push origin feature/24-comment
```

#### レビュー＆テストフェーズ
1. **セルフレビュー**: 不要なコードの削除、フォーマット確認
2. **プルリクエストの作成**: 変更内容、テスト方法、スクリーンショットを含める
3. **自動テストとCI/CD**: GitHub Actionsによる自動検証
4. **コードレビュー**: 設計、可読性、テスト、パフォーマンス、セキュリティ
5. **フィードバック対応**: レビューコメントに基づく修正

### 3. バグ修正の流れ

#### バグの分類
- **Critical（緊急）**: サービス停止、データ損失の危険 → mainからhotfix
- **High（高）**: 主要機能の不具合 → developからbugfix
- **Medium/Low**: 限定的な影響 → developからbugfix

#### 修正フロー
```bash
# 1. バグ報告のIssue作成（詳細な再現手順、期待動作、実際の動作、エラーログ）

# 2. 緊急度に応じたブランチ作成
# 緊急の場合
git worktree add -b hotfix/28-critical-auth ../hotfix-auth main

# 通常の場合
git worktree add -b bugfix/27-login-validation ../bugfix-login develop

# 3. バグの再現とテスト作成
cd ../bugfix-login
# まず失敗するテストを書く
npm test -- --grep "email with plus sign"  # 失敗を確認

# 4. 修正の実装（最小限の変更）
git commit -m "test: メールアドレスに+記号を含む場合のテストを追加 #27"
git commit -m "fix: メールアドレスの+記号を正しく処理するように修正 #27"

# 5. 検証
npm test  # すべてのテストがパス
npm run dev  # 手動確認

# 6. プッシュとPR
git push origin bugfix/27-login-validation
```

## 🔄 並列開発のパターン

### 複数機能の同時開発

```bash
# 3つの機能を並行開発
../feature-login/     # ログイン機能（localhost:3000）
../feature-profile/   # プロフィール機能（localhost:3001）
../feature-dashboard/ # ダッシュボード（localhost:3002）

# 各ディレクトリで独立して開発サーバーを起動
cd ../feature-login && npm run dev
cd ../feature-profile && npm run dev -- --port 3001
cd ../feature-dashboard && npm run dev -- --port 3002
```

### レビュー対応中の新規開発

```bash
# PR待ちの間に別の作業を開始
../feature-A/  # レビュー待ち
../feature-B/  # 新規開発中
../bugfix-C/   # 緊急修正

# レビューコメントが来たらすぐに切り替え
cd ../feature-A
# 修正対応
git add .
git commit -m "fix: レビュー指摘事項を修正"
git push
```

## 🛠️ 便利なコマンド集

### worktree管理

```bash
# worktree一覧表示
git worktree list

# 不要なworktreeの削除
git worktree prune

# 特定のコミットからworktree作成
git worktree add -b feature/test ../test-feature abc123def
```

### ブランチ管理

```bash
# リモートブランチの最新化
git fetch --all --prune

# マージ済みブランチの削除
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

## 📝 コミットメッセージ規約

### Conventional Commits形式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更
- `refactor`: バグ修正や機能追加を伴わないコード変更
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

#### 例
```bash
git commit -m "feat(auth): JWT認証を実装"
git commit -m "fix: メモリリークを修正"
git commit -m "docs: READMEにインストール手順を追加"
```

## 🤖 GitHub連携機能

### GitHub Actions（自動化）

`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

### PR作成時のチェックリスト

```markdown
## 変更内容
- [ ] 機能の説明を記載
- [ ] テストを追加/更新
- [ ] ドキュメントを更新

## テスト
- [ ] ローカルでテスト実行
- [ ] 手動での動作確認

## レビュー依頼事項
- 特に確認してほしい箇所を記載
```

## 💡 Tips & Best Practices

### 1. worktreeの命名規則
```bash
# 推奨される命名パターン
../feature-login       # 機能開発
../bugfix-auth        # バグ修正
../hotfix-critical    # 緊急修正
../experiment-new-ui  # 実験的変更
```

### 2. 並列開発の注意点
- 各worktreeで異なるポートを使用
- node_modulesは各worktreeで独立管理
- 環境変数は各worktreeで設定

### 3. クリーンアップの習慣
```bash
# 週次でのクリーンアップ
git worktree prune
git remote prune origin
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

### 4. トラブルシューティング

worktreeが削除できない場合:
```bash
# 強制削除
git worktree remove --force ../feature-xxx

# 手動削除後のクリーンアップ
rm -rf ../feature-xxx
git worktree prune
```

ブランチの切り替えができない場合:
```bash
# 未コミットの変更を一時保存
git stash
# または
git commit -m "WIP: 作業中の変更"
```

## 🎯 まとめ

Git worktreeを活用することで：
- ✅ 複数の作業を物理的に分離して管理
- ✅ コンテキストスイッチのコストを最小化
- ✅ 並列開発による生産性向上
- ✅ レビュー対応と新規開発の両立

このフローに従うことで、効率的で整理された開発環境を維持できます。