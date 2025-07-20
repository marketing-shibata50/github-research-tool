---
layout: default
title: "GitHub開発ワークフロー完全ガイド - いつ、何を、どう使うか"
description: "実際の開発でGitHubの各機能をどのタイミングで使うか、具体例で解説"
---

# 🚀 GitHub開発ワークフロー完全ガイド

実際の開発プロジェクトで、GitHubの機能をいつ、どのように使うのか、時系列で解説します。

---

## 📅 プロジェクト開始前（Day 0）

### 1. リポジトリ作成
```bash
# プロジェクト名を決めて作成
gh repo create my-awesome-app --public --add-readme
```

### 2. 初期設定
```yaml
# .github/ISSUE_TEMPLATE/bug_report.md
# .github/ISSUE_TEMPLATE/feature_request.md
# .github/pull_request_template.md
# .gitignore
# README.md
```

### 3. Project作成
```
GitHub → Projects → New project
├── 名前: "My App Development"
├── テンプレート: "Team backlog"
└── フィールド追加: Priority, Story Points, Sprint
```

### 4. 初期Issue作成
```markdown
Issue #1: プロジェクト初期設定
- [ ] 開発環境構築手順書作成
- [ ] コーディング規約決定
- [ ] CI/CD設定

Issue #2: 基本機能の要件定義
- [ ] ユーザーストーリー作成
- [ ] 画面設計
- [ ] API設計
```

---

## 🏃 開発開始（Week 1）

### 月曜日：スプリント計画

#### 9:00 - Project Boardで計画
```
1. Projectsを開く
2. BacklogからSprint 1に移動:
   - Issue #3: ユーザー認証機能
   - Issue #4: データベース設計
   - Issue #5: ログイン画面UI
3. 各Issueにポイント設定
```

#### 10:00 - チーム割り当て
```markdown
# Issue #3 にコメント
@frontend-dev ログイン画面お願いします
@backend-dev 認証APIお願いします
期限: 金曜日まで
```

### 火曜日：開発作業

#### 9:00 - ブランチ作成
```bash
# 最新のmainを取得
git checkout main
git pull origin main

# 機能ブランチ作成
git checkout -b feature/user-authentication
```

#### 10:00 - 開発中
```bash
# こまめにコミット
git add src/components/LoginForm.jsx
git commit -m "feat: ログインフォームのUI実装 #3"

# 1日の終わりにPush
git push origin feature/user-authentication
```

#### 17:00 - Draft PR作成
```bash
# まだ完成していないけどPR作成
gh pr create --draft --title "WIP: ユーザー認証機能 #3"
```

### 水曜日：進捗確認

#### 10:00 - スタンドアップ（Projectsで確認）
```
Projects → Board View
├── To Do: 2件
├── In Progress: 3件 ← ここを確認
├── In Review: 0件
└── Done: 1件
```

#### 14:00 - Issue更新
```markdown
# Issue #3 にコメント
## 進捗報告
- ✅ ログインフォームUI完成
- ✅ バリデーション実装
- 🚧 API連携作業中
- ⏳ テスト作成予定

残タスク:
- [ ] エラーハンドリング
- [ ] ローディング表示
```

### 木曜日：コードレビュー

#### 10:00 - PR準備完了
```bash
# Draft から通常のPRに変更
gh pr ready

# PR説明を更新
```

```markdown
## 概要
ユーザー認証機能を実装しました。

## 変更内容
- ログインフォームコンポーネント
- 認証API（JWT使用）
- Reduxでの状態管理

## スクリーンショット
![ログイン画面](./screenshots/login.png)

## テスト
- [x] ユニットテスト追加
- [x] E2Eテスト追加
- [x] 手動テスト完了

Closes #3
```

#### 14:00 - レビュー対応
```markdown
# PR上でのやり取り
@reviewer: 23行目、エラーハンドリングが不足していませんか？

@developer: 修正しました！確認お願いします。
commit: a1b2c3d
```

### 金曜日：マージとデプロイ

#### 10:00 - 最終確認
```yaml
# GitHub Actions が全て ✅ グリーン
- Build: ✅ Passed
- Test: ✅ Passed  
- Lint: ✅ Passed
- Security: ✅ Passed
```

#### 11:00 - マージ
```
1. PR ページで "Squash and merge"
2. コミットメッセージを整理
3. "Confirm merge"
4. ブランチ自動削除
```

#### 11:30 - 自動デプロイ
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

# 自動的にステージング環境へデプロイ
```

#### 15:00 - スプリント振り返り
```markdown
# ProjectsでSprint 1を確認
完了: 8件
未完了: 2件 → 次スプリントへ

# 新しいDiscussion作成
タイトル: Sprint 1 振り返り
カテゴリ: Team Updates
```

---

## 🔄 日常的な開発サイクル

### 毎朝のルーティン（5分）
```bash
# 1. 最新を取得
git checkout main
git pull origin main

# 2. 自分のブランチを更新
git checkout feature/my-feature
git rebase main

# 3. GitHub通知確認
# - 自分へのメンション
# - レビューリクエスト
# - CI/CDの結果
```

### Issue駆動開発
```
1. Issue確認 → 今日やること決定
2. ブランチ作成 → feature/issue-番号
3. 開発 → コミットメッセージに #番号
4. PR作成 → Issueと自動リンク
5. マージ → Issue自動クローズ
```

### コミットのタイミング
```bash
# ❌ 悪い例：1日分をまとめてコミット
git add .
git commit -m "今日の作業"

# ✅ 良い例：機能単位でコミット
git add src/components/Button.jsx
git commit -m "feat(ui): カスタムボタンコンポーネント追加"

git add src/styles/button.css  
git commit -m "style(ui): ボタンのスタイル追加"

git add tests/Button.test.js
git commit -m "test(ui): ボタンコンポーネントのテスト追加"
```

---

## 🚨 トラブル発生時

### バグ発見（緊急度：高）
```bash
# 1. Issue作成
gh issue create \
  --title "🐛 決済処理でエラー発生" \
  --label "bug,urgent,production" \
  --assignee "@payment-team"

# 2. Hotfixブランチ
git checkout -b hotfix/payment-error

# 3. 修正 → テスト → PR
# 4. 緊急マージ（レビュー1人でOK）
```

### 機能追加リクエスト
```markdown
# Discussions で議論
カテゴリ: Ideas
タイトル: ダークモード対応について

# 合意が取れたらIssue化
Issue #45: ダークモード実装
ラベル: enhancement, ui, sprint-3
```

---

## 📊 週次・月次の活動

### 週次レビュー（金曜日）
```
1. Projects確認
   - 完了タスク数
   - ベロシティ計算
   - 来週の計画

2. Insights確認
   - コード頻度
   - コントリビューター統計
   - PR/Issueの傾向

3. Wiki更新
   - リリースノート
   - 新機能のドキュメント
```

### 月次活動
```
1. マイルストーン設定
   - 次月の大目標
   - リリース計画

2. セキュリティレビュー
   - Dependabot アラート確認
   - セキュリティアドバイザリ

3. パフォーマンス分析
   - Actions の実行時間
   - ビルド時間の最適化
```

---

## 🎯 シチュエーション別ガイド

### 新機能開発
```
1. Discussion で提案
2. Issue 作成
3. Projects に追加
4. ブランチ → 開発 → PR
5. レビュー → マージ
6. Release 作成
```

### バグ修正
```
1. Issue でバグ報告
2. 再現確認
3. Hotfixブランチ
4. 修正 → テスト
5. 緊急PR → マージ
6. パッチリリース
```

### ドキュメント更新
```
1. Wiki 直接編集
   または
2. docs/ フォルダで管理
3. PR でレビュー
4. GitHub Pages 自動更新
```

### 外部コントリビュータ
```
1. Fork してもらう
2. Contribution Guide 参照
3. PR 受け取り
4. レビュー & フィードバック
5. マージ or 修正依頼
```

---

## 💡 プロのTips

### 1. ラベルの活用
```yaml
種類:
  - bug: 不具合
  - feature: 新機能
  - docs: ドキュメント

優先度:
  - P0: 今すぐ
  - P1: 今週中
  - P2: 今月中

状態:
  - ready: 着手可能
  - blocked: ブロック中
  - needs-review: レビュー待ち
```

### 2. 自動化の極意
```yaml
# PR作成時に自動でProjectsに追加
# Issue作成時に自動でラベル付け
# マージ時に自動でデプロイ
# 定期的な依存関係更新
```

### 3. コミュニケーション
```markdown
# Issue/PRでの良いコメント
- 具体的な問題説明
- 再現手順
- 期待する結果
- スクリーンショット
- 関連リンク
```

---

## 📈 成果の可視化

### GitHub Insights 活用
```
Code frequency: コード追加/削除の推移
Pulse: 週次/月次のアクティビティ
Contributors: 誰がどれだけ貢献したか
Traffic: リポジトリの人気度
```

### Projects の分析
```
- スプリント完了率
- 平均リードタイム
- サイクルタイム
- 未完了タスクの傾向
```

---

## 🎉 まとめ

GitHubを使った開発は、**Issue → Branch → Commit → PR → Merge** のサイクルが基本。

各機能を適切なタイミングで使うことで：
- 進捗が可視化される
- チーム連携がスムーズ
- 品質が保たれる
- 履歴が残る

まずは小さく始めて、徐々に機能を増やしていきましょう！