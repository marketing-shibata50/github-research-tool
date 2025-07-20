---
layout: default
title: "GitHub Actions完全ガイド"
description: "Jenkins・CircleCI代替のCI/CD自動化とGitHub Actions完全活用法"
---

# ⚡ GitHub Actions - 完全なCI/CD自動化

GitHub Actionsを活用して、Jenkins・CircleCI・GitLab CI・Azure DevOpsなどの外部CI/CDツールに依存しない、統合された自動化環境を構築する完全ガイド。コードのビルド・テスト・デプロイから、複雑なワークフロー自動化まで網羅します。

## 🎯 学習目標

- GitHub Actions の全機能理解と実践的活用
- 外部CI/CDツールからの完全移行戦略
- セキュアで効率的なワークフロー設計
- 高度な自動化とDevOps実践
- コスト最適化と運用効率向上

## 📚 目次

1. [GitHub Actions 基本概念](#1-github-actions-基本概念)
2. [CI/CDパイプライン構築](#2-cicdパイプライン構築)
3. [高度なワークフロー設計](#3-高度なワークフロー設計)
4. [セキュリティ・シークレット管理](#4-セキュリティシークレット管理)
5. [外部ツールからの移行](#5-外部ツールからの移行)
6. [運用最適化・監視](#6-運用最適化監視)

---

## 1. GitHub Actions 基本概念

### 🏗️ アーキテクチャ理解

#### 核心コンポーネント
```yaml
# GitHub Actions の基本構造
Workflow (ワークフロー)
├── Events (イベント) - トリガー条件
├── Jobs (ジョブ) - 実行単位
│   ├── Steps (ステップ) - 個別タスク
│   │   ├── Actions (アクション) - 再利用可能な処理
│   │   └── Commands (コマンド) - シェル実行
│   └── Runner (ランナー) - 実行環境
├── Secrets (シークレット) - 機密情報
└── Environment (環境) - デプロイメント設定
```

#### 基本ワークフロー例
```yaml
# .github/workflows/basic-ci.yml
name: Basic CI Pipeline

# イベント定義
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # 毎週月曜 2時

# グローバル環境変数
env:
  NODE_VERSION: '18'
  CACHE_KEY: node-modules

jobs:
  # ジョブ1: コード品質チェック
  quality-check:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint check
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Security audit
        run: npm audit --audit-level high

  # ジョブ2: テスト実行
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: quality-check
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
        env:
          CI: true
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == 18 && matrix.os == 'ubuntu-latest'
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### 🎛️ イベントトリガーの活用

#### 包括的なトリガー設定
```yaml
# 高度なイベント設定例
on:
  # プッシュイベント
  push:
    branches: 
      - main
      - 'release/**'
      - 'hotfix/**'
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
    tags:
      - 'v*'
  
  # プルリクエストイベント
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    branches: [main, develop]
    paths-ignore:
      - 'docs/**'
      - '*.md'
  
  # Issue イベント
  issues:
    types: [opened, labeled, assigned]
  
  # リリースイベント
  release:
    types: [published, prereleased]
  
  # スケジュール実行
  schedule:
    - cron: '0 2 * * 1-5'    # 平日 2時
    - cron: '0 10 * * 6'     # 土曜 10時
  
  # 手動実行
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      debug:
        description: 'Enable debug logging'
        required: false
        default: false
        type: boolean
      version:
        description: 'Version to deploy'
        required: false
        type: string

  # 他のワークフローからの呼び出し
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      api-key:
        required: true
```

---

## 2. CI/CDパイプライン構築

### 🔄 フルスタックCI/CDパイプライン

#### Node.js アプリケーション用
```yaml
# .github/workflows/nodejs-cicd.yml
name: Node.js CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ステージ1: ビルド・テスト
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    
    outputs:
      version: ${{ steps.version.outputs.version }}
      image-digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Generate version
        id: version
        run: |
          if [[ $GITHUB_REF == refs/tags/* ]]; then
            VERSION=${GITHUB_REF#refs/tags/}
          else
            VERSION=$(git describe --tags --always --dirty)
          fi
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          VERSION: ${{ steps.version.outputs.version }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist/
            package.json
            package-lock.json
          retention-days: 7

  # ステージ2: セキュリティスキャン
  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: build-and-test
    
    permissions:
      security-events: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'my-project'
          path: '.'
          format: 'SARIF'
          args: >
            --enableRetired
            --enableExperimental
            --failOnCVSS 7

  # ステージ3: E2Eテスト
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build-and-test
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: |
          npm run db:migrate
          npm run db:seed
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Start application
        run: |
          npm start &
          npx wait-on http://localhost:3000 --timeout 60000
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-results
          path: |
            test-results/
            playwright-report/

  # ステージ4: Dockerイメージビルド
  build-image:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [build-and-test, security-scan]
    if: github.event_name == 'push'
    
    permissions:
      contents: read
      packages: write
    
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
      
      - name: Build and push image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            VERSION=${{ needs.build-and-test.outputs.version }}
      
      - name: Output image
        id: image
        run: echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build-and-test.outputs.version }}" >> $GITHUB_OUTPUT

  # ステージ5: ステージング環境デプロイ
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build-image, e2e-tests]
    if: github.ref == 'refs/heads/develop'
    
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - name: Deploy to staging
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'my-app-staging'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}
          images: ${{ needs.build-image.outputs.image }}
      
      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1
          curl -f https://staging.example.com/api/status || exit 1

  # ステージ6: 本番環境デプロイ
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build-image, deploy-staging]
    if: github.ref == 'refs/heads/main'
    
    environment:
      name: production
      url: https://example.com
    
    steps:
      - name: Deploy to production
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'my-app-production'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_PRODUCTION }}
          images: ${{ needs.build-image.outputs.image }}
      
      - name: Run production smoke tests
        run: |
          curl -f https://example.com/health || exit 1
          curl -f https://example.com/api/status || exit 1
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 🐍 Python アプリケーション用
```yaml
# .github/workflows/python-cicd.yml
name: Python CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11']
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Lint with flake8
        run: |
          flake8 src/ tests/ --count --select=E9,F63,F7,F82 --show-source --statistics
          flake8 src/ tests/ --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
      
      - name: Type check with mypy
        run: mypy src/
      
      - name: Test with pytest
        run: |
          pytest tests/ --cov=src/ --cov-report=xml --cov-report=html
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          flags: unittests
          name: codecov-umbrella

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install safety bandit
      
      - name: Run safety check
        run: safety check
      
      - name: Run bandit security check
        run: bandit -r src/ -f json -o bandit-report.json
      
      - name: Upload security scan results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: security-reports
          path: bandit-report.json

  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Build package
        run: |
          python -m pip install --upgrade pip build
          python -m build
      
      - name: Deploy to PyPI
        uses: pypa/gh-action-pypi-publish@release/v1
        with:
          password: ${{ secrets.PYPI_API_TOKEN }}
```

---

## 3. 高度なワークフロー設計

### 🔄 再利用可能ワークフロー

#### 共通CI/CDテンプレート
```yaml
# .github/workflows/reusable-ci.yml
name: Reusable CI Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
      environment:
        required: false
        type: string
        default: 'development'
      run-e2e:
        required: false
        type: boolean
        default: false
    secrets:
      NPM_TOKEN:
        required: false
      CODECOV_TOKEN:
        required: false
    outputs:
      build-version:
        description: "Built application version"
        value: ${{ jobs.build.outputs.version }}
      artifact-name:
        description: "Build artifact name"
        value: ${{ jobs.build.outputs.artifact-name }}

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    
    outputs:
      version: ${{ steps.version.outputs.version }}
      artifact-name: ${{ steps.artifact.outputs.name }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Generate version
        id: version
        run: |
          VERSION=$(date +%Y%m%d)-$(git rev-parse --short HEAD)
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        if: secrets.CODECOV_TOKEN != ''
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: ${{ inputs.environment }}
          VERSION: ${{ steps.version.outputs.version }}
      
      - name: Create artifact
        id: artifact
        run: |
          ARTIFACT_NAME="build-${{ steps.version.outputs.version }}"
          echo "name=$ARTIFACT_NAME" >> $GITHUB_OUTPUT
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ steps.artifact.outputs.name }}
          path: dist/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    if: inputs.run-e2e
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: ${{ needs.build.outputs.artifact-name }}
          path: dist/
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
```

#### ワークフローの呼び出し
```yaml
# .github/workflows/main-ci.yml
name: Main CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Continuous Integration
    uses: ./.github/workflows/reusable-ci.yml
    with:
      node-version: '18'
      environment: 'production'
      run-e2e: true
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
  
  deploy:
    name: Deploy Application
    runs-on: ubuntu-latest
    needs: ci
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: ${{ needs.ci.outputs.artifact-name }}
      
      - name: Deploy to production
        run: |
          echo "Deploying version ${{ needs.ci.outputs.build-version }}"
          # デプロイメントロジック
```

### 🎯 コンポジットアクション

#### カスタムアクション作成
```yaml
# .github/actions/setup-app/action.yml
name: 'Setup Application'
description: 'Setup Node.js application with caching and dependencies'

inputs:
  node-version:
    description: 'Node.js version to use'
    required: false
    default: '18'
  cache-dependency-path:
    description: 'Path to dependency file'
    required: false
    default: 'package-lock.json'
  install-command:
    description: 'Command to install dependencies'
    required: false
    default: 'npm ci'

outputs:
  cache-hit:
    description: 'Cache hit status'
    value: ${{ steps.cache.outputs.cache-hit }}
  node-version:
    description: 'Installed Node.js version'
    value: ${{ steps.setup-node.outputs.node-version }}

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      id: setup-node
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
        cache-dependency-path: ${{ inputs.cache-dependency-path }}
    
    - name: Cache node modules
      id: cache
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles(inputs.cache-dependency-path) }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    - name: Install dependencies
      shell: bash
      run: ${{ inputs.install-command }}
      env:
        NODE_AUTH_TOKEN: ${{ env.NODE_AUTH_TOKEN }}
    
    - name: Verify installation
      shell: bash
      run: |
        echo "Node.js version: $(node --version)"
        echo "npm version: $(npm --version)"
        echo "Dependencies installed successfully"
```

#### アクションの使用
```yaml
# ワークフローでの使用例
steps:
  - uses: actions/checkout@v4
  
  - name: Setup application
    uses: ./.github/actions/setup-app
    with:
      node-version: '18'
      install-command: 'npm ci --production'
  
  - name: Build application
    run: npm run build
```

---

## 4. セキュリティ・シークレット管理

### 🔐 シークレット管理戦略

#### 環境別シークレット設定
```yaml
# セキュリティベストプラクティス
name: Secure Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Secure Deployment
    runs-on: ubuntu-latest
    
    # 環境の設定
    environment:
      name: production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ vars.AWS_REGION }}
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          role-session-name: GitHubActions
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ${{ vars.ECR_REPOSITORY }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster ${{ vars.ECS_CLUSTER }} \
            --service ${{ vars.ECS_SERVICE }} \
            --force-new-deployment
```

#### OIDC プロバイダー認証
```yaml
# クラウドプロバイダーとのOIDC認証
name: OIDC Authentication

on:
  push:
    branches: [main]

permissions:
  id-token: write   # OIDC トークン取得に必要
  contents: read

jobs:
  deploy-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          role-session-name: GitHubActions
          aws-region: us-east-1
      
      - name: Deploy to AWS
        run: |
          aws s3 sync ./dist s3://${{ vars.S3_BUCKET }}/

  deploy-azure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      - name: Deploy to Azure
        run: |
          az webapp deployment source config-zip \
            --resource-group ${{ vars.AZURE_RESOURCE_GROUP }} \
            --name ${{ vars.AZURE_APP_NAME }} \
            --src ./dist.zip
```

### 🛡️ セキュリティスキャン自動化

#### 包括的セキュリティチェック
```yaml
# .github/workflows/security-scan.yml
name: Security Scanning

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 3 * * 1'  # 毎週月曜 3時

permissions:
  security-events: write
  contents: read

jobs:
  code-scanning:
    name: Code Scanning
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        language: ['javascript', 'python']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
          queries: security-extended,security-and-quality
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:${{matrix.language}}"

  dependency-scanning:
    name: Dependency Scanning
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --sarif-file-output=snyk.sarif
      
      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: snyk.sarif

  container-scanning:
    name: Container Scanning
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t test-image .
      
      - name: Run Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'test-image'
          format: 'sarif'
          output: 'trivy-container.sarif'
      
      - name: Upload container scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-container.sarif'

  secret-scanning:
    name: Secret Scanning
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified
```

---

## 5. 外部ツールからの移行

### 🔄 Jenkins からの移行

#### Jenkinsfile → GitHub Actions 変換例
```groovy
// 元のJenkinsfile
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'myregistry.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results.xml'
                        }
                    }
                }
                
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t $DOCKER_REGISTRY/myapp:$BUILD_NUMBER .'
                sh 'docker push $DOCKER_REGISTRY/myapp:$BUILD_NUMBER'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            mail to: 'team@example.com',
                 subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                 body: "Build failed. Check console output."
        }
    }
}
```

```yaml
# 変換後のGitHub Actions
name: Migrated from Jenkins

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  DOCKER_REGISTRY: 'myregistry.com'

jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
    
    outputs:
      build-number: ${{ steps.build-number.outputs.number }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Generate build number
        id: build-number
        run: echo "number=${{ github.run_number }}" >> $GITHUB_OUTPUT
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: build
    
    strategy:
      matrix:
        test-type: [unit, e2e]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/
      
      - name: Run tests
        run: npm run test:${{ matrix.test-type }}
      
      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: ${{ matrix.test-type }} Tests
          path: test-results.xml
          reporter: jest-junit

  deploy:
    name: Deploy Application
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.DOCKER_REGISTRY }}/myapp:${{ needs.build.outputs.build-number }}
      
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#alerts'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          message: |
            Build Failed: ${{ github.workflow }} - ${{ github.run_number }}
            Check the console output for details.
```

### 📊 移行比較表

| 機能 | Jenkins | CircleCI | GitLab CI | GitHub Actions | 備考 |
|------|---------|----------|-----------|----------------|------|
| **セットアップ** | 複雑 | 簡単 | 中程度 | 最も簡単 | GitHub統合 |
| **設定ファイル** | Groovy | YAML | YAML | YAML | GitHub Actionsが最も直感的 |
| **並列実行** | ✅ | ✅ | ✅ | ✅ | matrix戦略が優秀 |
| **キャッシュ** | プラグイン | ✅ | ✅ | ✅ | 設定が最もシンプル |
| **シークレット管理** | プラグイン | ✅ | ✅ | ✅ | 環境別管理が優秀 |
| **コスト（中規模）** | 高 | 中 | 中 | 低 | 無料枠が大きい |
| **学習コスト** | 高 | 中 | 中 | 低 | 広く普及 |
| **拡張性** | 高 | 中 | 高 | 高 | Marketplaceが充実 |

---

## 6. 運用最適化・監視

### 📊 パフォーマンス最適化

#### 高速ビルド戦略
```yaml
# .github/workflows/optimized-ci.yml
name: Optimized CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  changes:
    name: Detect Changes
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.changes.outputs.frontend }}
      backend: ${{ steps.changes.outputs.backend }}
      docs: ${{ steps.changes.outputs.docs }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'package.json'
            backend:
              - 'backend/**'
              - 'requirements.txt'
            docs:
              - 'docs/**'
              - '*.md'

  frontend-ci:
    name: Frontend CI
    runs-on: ubuntu-latest
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js with cache
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Restore node_modules cache
        uses: actions/cache@v3
        with:
          path: frontend/node_modules
          key: ${{ runner.os }}-nodemodules-${{ hashFiles('frontend/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-nodemodules-
      
      - name: Install dependencies
        run: npm ci --prefix frontend
      
      - name: Parallel build and test
        run: |
          npm run build --prefix frontend &
          npm run test --prefix frontend &
          wait

  backend-ci:
    name: Backend CI
    runs-on: ubuntu-latest
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python with cache
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
          cache-dependency-path: 'backend/requirements.txt'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest --maxfail=1 --disable-warnings -q

  docs-check:
    name: Documentation Check
    runs-on: ubuntu-latest
    needs: changes
    if: needs.changes.outputs.docs == 'true'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Check documentation
        run: |
          # ドキュメントの軽量チェック
          echo "Checking documentation..."
          # 実際のドキュメントビルド・リンクチェック等
```

### 📈 モニタリング・メトリクス

#### 詳細メトリクス収集
```yaml
# .github/workflows/metrics-collection.yml
name: CI/CD Metrics Collection

on:
  workflow_run:
    workflows: ["Main CI", "Deploy Pipeline"]
    types: [completed]

jobs:
  collect-metrics:
    name: Collect CI/CD Metrics
    runs-on: ubuntu-latest
    
    steps:
      - name: Collect workflow metrics
        uses: actions/github-script@v6
        with:
          script: |
            const workflowRun = context.payload.workflow_run;
            
            // ワークフロー実行時間の計算
            const startTime = new Date(workflowRun.created_at);
            const endTime = new Date(workflowRun.updated_at);
            const duration = (endTime - startTime) / 1000; // 秒
            
            // メトリクスデータの作成
            const metrics = {
              workflow_name: workflowRun.name,
              status: workflowRun.conclusion,
              duration_seconds: duration,
              commit_sha: workflowRun.head_sha,
              branch: workflowRun.head_branch,
              trigger_event: workflowRun.event,
              run_number: workflowRun.run_number,
              timestamp: workflowRun.created_at
            };
            
            // メトリクスをログ出力
            console.log('CI/CD Metrics:', JSON.stringify(metrics, null, 2));
            
            // 外部監視システムに送信（例：DataDog、Prometheus等）
            if (process.env.DATADOG_API_KEY) {
              await fetch('https://api.datadoghq.com/api/v1/series', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'DD-API-KEY': process.env.DATADOG_API_KEY
                },
                body: JSON.stringify({
                  series: [{
                    metric: 'github_actions.workflow.duration',
                    points: [[Math.floor(Date.now() / 1000), duration]],
                    tags: [
                      `workflow:${workflowRun.name}`,
                      `status:${workflowRun.conclusion}`,
                      `branch:${workflowRun.head_branch}`
                    ]
                  }]
                })
              });
            }
        env:
          DATADOG_API_KEY: ${{ secrets.DATADOG_API_KEY }}
      
      - name: Generate weekly report
        if: github.event.schedule == '0 9 * * 1'  # 毎週月曜日
        uses: actions/github-script@v6
        with:
          script: |
            // 過去1週間のワークフロー実行データを取得
            const { data: runs } = await github.rest.actions.listWorkflowRunsForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              per_page: 100,
              created: `>=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`
            });
            
            // メトリクス集計
            const metrics = runs.workflow_runs.reduce((acc, run) => {
              const duration = (new Date(run.updated_at) - new Date(run.created_at)) / 1000;
              
              if (!acc[run.name]) {
                acc[run.name] = {
                  total_runs: 0,
                  successful_runs: 0,
                  failed_runs: 0,
                  total_duration: 0,
                  avg_duration: 0
                };
              }
              
              acc[run.name].total_runs++;
              acc[run.name].total_duration += duration;
              
              if (run.conclusion === 'success') {
                acc[run.name].successful_runs++;
              } else if (run.conclusion === 'failure') {
                acc[run.name].failed_runs++;
              }
              
              acc[run.name].avg_duration = acc[run.name].total_duration / acc[run.name].total_runs;
              
              return acc;
            }, {});
            
            // レポート生成
            let report = '# GitHub Actions Weekly Report\n\n';
            
            for (const [workflow, data] of Object.entries(metrics)) {
              const successRate = ((data.successful_runs / data.total_runs) * 100).toFixed(2);
              
              report += `## ${workflow}\n`;
              report += `- **Total Runs**: ${data.total_runs}\n`;
              report += `- **Success Rate**: ${successRate}%\n`;
              report += `- **Average Duration**: ${Math.round(data.avg_duration)}s\n`;
              report += `- **Failed Runs**: ${data.failed_runs}\n\n`;
            }
            
            // Issueとしてレポートを投稿
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Weekly CI/CD Report - ${new Date().toISOString().split('T')[0]}`,
              body: report,
              labels: ['metrics', 'weekly-report']
            });
```

---

## 🎓 実践演習

### 演習1: フルスタックCI/CDパイプライン構築
1. **多言語対応** - Node.js + Python のモノレポ
2. **並列実行** - 言語別の独立したジョブ
3. **条件分岐** - 変更検知による最適化
4. **成果物管理** - アーティファクトの効率的な受け渡し

### 演習2: セキュリティファーストパイプライン
1. **コード解析** - CodeQL・Semgrep統合
2. **依存関係スキャン** - Snyk・Trivy活用
3. **シークレット検知** - TruffleHog導入
4. **コンテナセキュリティ** - イメージスキャン自動化

### 演習3: 外部ツール移行プロジェクト
1. **現状分析** - 既存CI/CDの機能・設定調査
2. **移行戦略** - 段階的移行計画立案
3. **並行運用** - リスク軽減・検証期間設定
4. **完全移行** - 旧システム停止・運用移管

---

## 🔗 関連リソース

### 公式ドキュメント
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

### 移行・活用ツール
- [Jenkins to GitHub Actions Migration](https://github.com/actions/importer)
- [Actions Toolkit](https://github.com/actions/toolkit)
- [Runner Images](https://github.com/actions/runner-images)

### 監視・最適化ツール
- [ActionLint](https://github.com/rhymond/actionlint) - ワークフロー検証
- [GitHub Actions Usage Metrics](https://github.com/github/actions-usage-metrics)
- [Workflow Optimization Guide](https://docs.github.com/en/actions/using-workflows/about-workflows#using-starter-workflows)

---

## 📝 まとめ

GitHub Actions を効果的に活用することで：

✅ **外部ツール不要** - Jenkins・CircleCIからの完全移行
✅ **コスト大幅削減** - インフラ・ライセンス費用の最適化  
✅ **統合開発環境** - コードとCI/CDの一元管理
✅ **高度な自動化** - セキュリティ・品質・デプロイの自動化
✅ **スケーラビリティ** - 企業レベルの大規模開発対応

次は[GitHub Security編](06-github-security.md)で、総合的なセキュリティ対策を学習しましょう。

## 🔗 関連ガイド

- **前のステップ**: [GitHub Projects編](04-github-projects.md) - プロジェクト管理の最適化
- **次のステップ**: [GitHub Security編](06-github-security.md) - 総合的なセキュリティ対策
- **さらに学習**: [GitHub Pages編](07-github-pages.md) - Webサイト・ドキュメント公開
- **基礎知識**: [Pull Request編](03-pull-requests.md) - CI/CD連携の基礎
- **総合ガイド**: [GitHub完全活用ガイド](../GITHUB_COMPLETE_GUIDE.md) - 全機能の詳細解説

## 📖 学習フロー

```mermaid
graph LR
    A[リポジトリ基礎] --> B[Issues管理]
    B --> C[Pull Request]
    C --> D[GitHub Projects]
    D --> E[GitHub Actions]
    E --> F[Security] 
    F --> G[Pages]
    G --> H[完全活用]
    
    style A fill:#f3e5f5
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#e1f5fe
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style H fill:#fce4ec
```