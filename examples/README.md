# 🛠️ GitHub Research Tool - 実装例

このディレクトリには、実際に使用できるGitHub機能の実装例が含まれています。

## 📁 ディレクトリ構成

### ⚙️ actions/
GitHub Actions設定ファイル集
- **ci.yml** - 基本的なCI/CDパイプライン
- **release.yml** - 自動リリース
- **security.yml** - セキュリティスキャン
- **deploy.yml** - デプロイ自動化
- **parallel-dev.yml** - AI駆動並列開発

### 📄 templates/
GitHubテンプレート集
- **Issue テンプレート**
  - バグ報告用
  - 機能要望用
  - 質問用
- **Pull Request テンプレート**
- **CODEOWNERS** - コードレビュー担当者設定
- **.github/FUNDING.yml** - スポンサー設定

### 📜 scripts/
便利なスクリプト集
- **setup-repo.sh** - リポジトリ初期化
- **create-release.sh** - リリース作成
- **sync-fork.sh** - フォーク同期
- **cleanup-branches.sh** - ブランチクリーンアップ

## 🚀 使い方

### 1. テンプレートのコピー
```bash
# Issue テンプレートをコピー
cp examples/templates/.github/ISSUE_TEMPLATE/* .github/ISSUE_TEMPLATE/

# PR テンプレートをコピー  
cp examples/templates/.github/pull_request_template.md .github/
```

### 2. GitHub Actionsの設定
```bash
# CI/CDワークフローをコピー
cp examples/actions/ci.yml .github/workflows/
```

### 3. スクリプトの実行
```bash
# リポジトリを初期化
bash examples/scripts/setup-repo.sh
```

## ⚠️ 注意事項

- 使用前にプロジェクトに応じてカスタマイズしてください
- シークレット情報は絶対に含めないでください
- ライセンスや利用規約を確認してください

## 🤝 コントリビューション

新しい実装例やテンプレートの追加を歓迎します！
プルリクエストを作成する前に、既存の例を参考にしてください。