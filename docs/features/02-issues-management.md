# 🎫 GitHub Issues 管理

GitHub Issuesを活用したプロジェクト管理とタスク追跡の完全ガイド。外部のプロジェクト管理ツールを使わずに、効率的な開発プロセスを構築する方法を学習します。

## 🎯 学習目標

- Issuesを使った効果的なタスク管理
- ラベル・マイルストーン・プロジェクトとの連携
- テンプレートによる標準化
- 自動化による効率向上
- 外部ツール（Jira等）との比較理解

## 📚 目次

1. [Issues基本操作](#1-issues基本操作)
2. [ラベル管理](#2-ラベル管理)
3. [マイルストーン管理](#3-マイルストーン管理)
4. [Issueテンプレート](#4-issueテンプレート)
5. [プロジェクトとの連携](#5-プロジェクトとの連携)
6. [自動化・効率化](#6-自動化効率化)
7. [外部ツールとの比較](#7-外部ツールとの比較)

---

## 1. Issues基本操作

### 📝 Issue作成

#### Web UIでの作成
```markdown
1. リポジトリページ → Issues → New issue
2. 入力項目：
   - Title: 簡潔で分かりやすいタイトル
   - Comment: 詳細な説明（Markdown記法使用可能）
   - Assignees: 担当者の指定
   - Labels: 分類用ラベル
   - Projects: 関連プロジェクト
   - Milestone: 対象マイルストーン
```

#### GitHub CLI での作成
```bash
# 基本的なIssue作成
gh issue create --title "バグ修正: ログイン機能が動作しない" --body "ログインボタンをクリックしても反応がない"

# テンプレートを使用してIssue作成
gh issue create --template bug_report.md

# ラベルと担当者を指定
gh issue create --title "新機能: ユーザープロフィール" --label "enhancement,frontend" --assignee username
```

### 🔍 Issue検索・フィルタリング

#### 高度な検索クエリ
```bash
# オープンなIssuesのみ
is:open is:issue

# 自分が担当のIssues
is:issue assignee:@me

# 特定のラベルが付いたIssues
is:issue label:bug

# 複数条件の組み合わせ
is:issue is:open label:enhancement assignee:username

# 作成日でフィルタ
is:issue created:>2024-01-01

# コメント数でフィルタ
is:issue comments:>5

# マイルストーンでフィルタ
is:issue milestone:"Version 2.0"
```

#### GitHub CLI での検索
```bash
# オープンなバグIssuesを表示
gh issue list --label bug --state open

# 自分が担当のIssuesを表示
gh issue list --assignee @me

# JSONで出力（スクリプト処理用）
gh issue list --json number,title,labels,assignees
```

### 💬 Issue管理

#### コメントとやり取り
```markdown
# メンション機能
@username こちらの件、確認をお願いします。

# 他のIssue参照
この問題は #123 と関連があります。

# コミット参照
この修正は a1b2c3d で対応済みです。

# PR参照
修正は #45 で対応中です。
```

#### Issue状態管理
```bash
# CLI でIssueをクローズ
gh issue close 123 --comment "修正が完了しました"

# 理由を指定してクローズ
gh issue close 123 --reason "completed"  # または "not planned"

# Issueを再オープン
gh issue reopen 123

# 担当者を変更
gh issue edit 123 --add-assignee newuser --remove-assignee olduser
```

---

## 2. ラベル管理

### 🏷️ 効果的なラベル体系

#### 推奨ラベル構成
```yaml
# 種類別（Type）
- bug: バグ報告
- enhancement: 新機能・改善
- documentation: ドキュメント関連
- question: 質問・サポート
- duplicate: 重複Issue

# 優先度別（Priority）
- priority:high: 緊急度高
- priority:medium: 通常優先度
- priority:low: 低優先度

# 状態別（Status）
- status:ready: 作業可能
- status:in-progress: 作業中
- status:blocked: ブロックされている
- status:review: レビュー待ち

# 領域別（Area）
- area:frontend: フロントエンド
- area:backend: バックエンド
- area:api: API関連
- area:ui-ux: UI/UX
- area:performance: パフォーマンス
- area:security: セキュリティ

# サイズ別（Effort）
- size:small: 小規模（1-2日）
- size:medium: 中規模（3-5日）
- size:large: 大規模（1週間以上）
```

#### ラベル作成と管理
```bash
# GitHub CLI でラベル作成
gh label create "priority:high" --color "FF0000" --description "緊急度の高いタスク"

# 既存ラベルの編集
gh label edit "bug" --color "FF6B6B" --description "バグ報告"

# ラベル一覧表示
gh label list

# ラベル削除
gh label delete "outdated-label"
```

### 🎨 ラベルの色分けとベストプラクティス

#### 色分けの推奨方式
```markdown
🔴 高優先度・緊急: #FF0000 (赤)
🟠 中優先度: #FFA500 (オレンジ)  
🟡 低優先度: #FFFF00 (黄)
🟢 完了・承認: #00FF00 (緑)
🔵 情報・質問: #0000FF (青)
🟣 進行中: #800080 (紫)
⚫ ブロック・問題: #000000 (黒)
```

---

## 3. マイルストーン管理

### 🎯 マイルストーンの設計

#### 効果的なマイルストーン例
```markdown
# バージョンベース
- v1.0.0 - 初回リリース (2024-03-01)
- v1.1.0 - 機能追加 (2024-04-15)
- v2.0.0 - メジャーアップデート (2024-06-30)

# 機能ベース
- User Authentication System
- Payment Integration
- Mobile App Support

# 時期ベース
- Q1 2024 Goals
- Summer Release
- Year-end Cleanup
```

#### マイルストーン作成と管理
```bash
# マイルストーン作成
gh issue create-milestone "v1.0.0" --description "初回リリース" --due-date "2024-03-01"

# マイルストーン一覧
gh issue list-milestones

# Issueをマイルストーンに割り当て
gh issue edit 123 --milestone "v1.0.0"
```

### 📊 進捗管理

#### マイルストーン進捗の可視化
```markdown
# マイルストーンページで確認できる情報：
- 全体の進捗率（パーセンテージ）
- オープン・クローズされたIssue数
- 期限までの残り時間
- 各Issueの状態
```

---

## 4. Issueテンプレート

### 📄 テンプレート作成

#### バグ報告テンプレート
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: 🐛 バグ報告
description: バグを報告するためのテンプレート
title: "[BUG] "
labels: ["bug", "needs-triage"]
assignees:
  - maintainer-username
body:
  - type: markdown
    attributes:
      value: |
        バグを報告いただき、ありがとうございます。以下の情報を詳しく記入してください。

  - type: textarea
    id: bug-description
    attributes:
      label: 🐛 バグの説明
      description: バグの詳細な説明を記入してください
      placeholder: 何が起こっているか、期待される動作との違いを説明
    validations:
      required: true

  - type: textarea
    id: reproduction-steps
    attributes:
      label: 🔄 再現手順
      description: バグを再現する手順を記入してください
      placeholder: |
        1. ○○のページに移動
        2. ○○をクリック
        3. ○○を入力
        4. エラーが発生
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: ✅ 期待される動作
      description: 本来はどのような動作を期待していましたか？
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: 🖥️ 環境情報
      description: 環境に関する情報
      placeholder: |
        - OS: [例: Windows 10, macOS 13.0, Ubuntu 20.04]
        - ブラウザ: [例: Chrome 108, Firefox 107, Safari 16]
        - バージョン: [例: v1.2.3]
    validations:
      required: true

  - type: textarea
    id: additional-context
    attributes:
      label: 📋 追加情報
      description: スクリーンショット、ログ、その他関連情報があれば記入してください
      placeholder: エラーメッセージ、スクリーンショットなど
```

#### 機能要求テンプレート
```yaml
# .github/ISSUE_TEMPLATE/feature_request.yml
name: ✨ 機能要求
description: 新機能や改善の要求
title: "[FEATURE] "
labels: ["enhancement", "needs-discussion"]
body:
  - type: markdown
    attributes:
      value: |
        新機能の提案をありがとうございます！

  - type: textarea
    id: problem-description
    attributes:
      label: 🎯 解決したい問題
      description: この機能によってどのような問題を解決したいですか？
      placeholder: 現在困っていることや、改善したい点を説明してください
    validations:
      required: true

  - type: textarea
    id: proposed-solution
    attributes:
      label: 💡 提案する解決策
      description: どのような機能や改善を提案しますか？
      placeholder: 具体的な機能の説明や実装案があれば記入してください
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: 🔄 代替案
      description: 他に考えられる解決策があれば記入してください
      placeholder: 別のアプローチや既存の回避策など

  - type: textarea
    id: additional-context
    attributes:
      label: 📋 追加情報
      description: 参考資料、モックアップ、外部リンクなど
      placeholder: 関連するリンクやファイルがあれば記入してください
```

### ⚙️ テンプレート設定

#### 設定ファイルの作成
```yaml
# .github/ISSUE_TEMPLATE/config.yml
blank_issues_enabled: false
contact_links:
  - name: 💬 Q&A ディスカッション
    url: https://github.com/username/repo/discussions
    about: 質問がある場合はこちらをご利用ください
  - name: 📖 ドキュメント
    url: https://docs.example.com
    about: 使い方やAPIドキュメントはこちら
```

---

## 5. プロジェクトとの連携

### 📋 GitHub Projects 連携

#### Issueの自動プロジェクト追加
```yaml
# .github/workflows/add-to-project.yml
name: Add Issue to Project
on:
  issues:
    types: [opened]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/users/username/projects/1
          github-token: ${{ secrets.ADD_TO_PROJECT_TOKEN }}
```

#### ラベルベースの自動ワークフロー
```yaml
# ラベルに応じて列を移動
name: Move Issue Based on Label
on:
  issues:
    types: [labeled]

jobs:
  move-issue:
    runs-on: ubuntu-latest
    if: github.event.label.name == 'in-progress'
    steps:
      - name: Move to In Progress
        uses: leonsteinhaeuser/project-beta-automations@v2.0.1
        with:
          gh_token: ${{ secrets.GITHUB_TOKEN }}
          user: username
          project_id: 1
          resource_node_id: ${{ github.event.issue.node_id }}
          status_value: "In Progress"
```

---

## 6. 自動化・効率化

### 🤖 GitHub Actions による自動化

#### Issue自動ラベリング
```yaml
# .github/workflows/label-issues.yml
name: Auto Label Issues
on:
  issues:
    types: [opened]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/labeler.yml
```

```yaml
# .github/labeler.yml
"area:frontend":
  - "**/*.js"
  - "**/*.vue"
  - "**/*.css"

"area:backend":
  - "**/*.py"
  - "**/*.go"
  - "**/*.java"

"documentation":
  - "**/*.md"
  - "docs/**/*"
```

#### 古いIssueの自動クローズ
```yaml
# .github/workflows/stale-issues.yml
name: Close Stale Issues
on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v8
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          stale-issue-message: |
            このIssueは60日間活動がありません。
            7日以内に活動がない場合、自動的にクローズされます。
          close-issue-message: |
            このIssueは非アクティブのため自動的にクローズされました。
          days-before-stale: 60
          days-before-close: 7
```

### 📊 Issue分析・レポート

#### CLI による統計取得
```bash
# Issue統計を取得するスクリプト
#!/bin/bash

echo "=== Issue Statistics ==="
echo "Total Issues: $(gh issue list --limit 1000 --json number | jq length)"
echo "Open Issues: $(gh issue list --state open --limit 1000 --json number | jq length)"
echo "Closed Issues: $(gh issue list --state closed --limit 1000 --json number | jq length)"

echo -e "\n=== Issues by Label ==="
gh issue list --limit 1000 --json labels | jq -r '.[].labels[].name' | sort | uniq -c | sort -nr

echo -e "\n=== Issues by Assignee ==="
gh issue list --limit 1000 --json assignees | jq -r '.[].assignees[].login' | sort | uniq -c | sort -nr
```

---

## 7. 外部ツールとの比較

### 📊 機能比較表

| 機能 | GitHub Issues | Jira | Trello | Linear | 備考 |
|------|---------------|------|--------|--------|------|
| 基本的なIssue管理 | ✅ | ✅ | ✅ | ✅ | 全て対応 |
| カスタムフィールド | ❌ | ✅ | ❌ | ✅ | GitHubはラベルで代用 |
| ワークフロー管理 | ⚠️ | ✅ | ⚠️ | ✅ | GitHubはActionsで実現 |
| 時間トラッキング | ❌ | ✅ | ⚠️ | ✅ | 外部サービス連携が必要 |
| レポート機能 | ⚠️ | ✅ | ❌ | ✅ | APIやInsightsを活用 |
| マイルストーン | ✅ | ✅ | ❌ | ✅ | GitHubのマイルストーン機能 |
| サブタスク | ❌ | ✅ | ✅ | ✅ | GitHubはタスクリストで代用 |
| コード連携 | ✅ | ⚠️ | ❌ | ⚠️ | GitHubが最も強力 |
| コスト | 無料〜 | 有料 | 無料〜 | 有料 | GitHubがコスト効率良い |

### 🔄 Jira からの移行

#### 移行チェックリスト
```markdown
✅ Issue種別 → ラベルでの分類方法決定
✅ ワークフロー → GitHub Projects V2 での再現
✅ カスタムフィールド → ラベルやマイルストーンでの代替
✅ レポート → GitHub API + スクリプトでの実現
✅ 時間管理 → 外部サービス連携の検討
✅ 権限管理 → リポジトリレベルでの設定調整
```

#### 移行スクリプト例
```python
# jira_to_github.py
import requests
import json

def migrate_issues(jira_url, github_repo, token):
    # Jira API からIssue取得
    jira_issues = fetch_jira_issues(jira_url)
    
    for issue in jira_issues:
        # GitHub Issue 形式に変換
        github_issue = {
            'title': issue['fields']['summary'],
            'body': convert_description(issue['fields']['description']),
            'labels': map_jira_labels(issue['fields']['labels'])
        }
        
        # GitHub API でIssue作成
        create_github_issue(github_repo, github_issue, token)
```

---

## 🎓 実践演習

### 演習1: Issue管理システム構築
1. バグ報告と機能要求のテンプレートを作成
2. 体系的なラベル分類を設計
3. マイルストーンを設定してIssueを分類

### 演習2: 自動化ワークフロー作成
1. 新しいIssueの自動ラベリング設定
2. 古いIssueの自動クローズ設定
3. プロジェクトボードとの連携設定

### 演習3: レポート・分析
1. Issue統計取得スクリプトの作成
2. 進捗レポートの自動生成
3. チームパフォーマンス分析

---

## 🔗 関連リソース

- [GitHub Docs - Issues](https://docs.github.com/en/issues)
- [GitHub Issues Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Issues](https://cli.github.com/manual/gh_issue)

---

## 📝 まとめ

GitHub Issues を効果的に活用することで：

✅ **統一されたタスク管理** - 外部ツール不要でプロジェクト管理
✅ **コードとの密接な連携** - コミット・PRとのシームレスな連携
✅ **自動化による効率化** - GitHub Actions による作業自動化
✅ **コスト削減** - 有料ツールからの移行によるコスト最適化
✅ **チーム協調** - 透明性の高い情報共有とコミュニケーション

次は[Pull Request編](03-pull-requests.md)で、コードレビューとマージプロセスを学習しましょう。