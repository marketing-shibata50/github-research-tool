越後さんの活用方法

mainを軸にするがいじるときはすべてbranchにしてる

issueごとにbranchを切って、完了後にmainにmergeする→同時に動かしている場合はどうすればいいのかな？
ステージング環境・開発環境のbranchも構築しておく

main
↓
開発環境
↓
issueごと

ってイメージ

PRは開発環境にmergeして確認を行うとのこと


worktree
→リポジトリと同レベルの階層にworktreeのフォルダが作られるとのこと



開発の流れを考えたい
1. 新規
2. 機能追加
3. テスト

シナリオ1：新規開発（ゼロからプロジェクトを始める）
これは、新しいアイデアを形にする最初のステップです。

計画フェーズ（何をやるか決める）

Issueを作成: まず、この新規プロジェクトで達成したいことの全体像を、一つの大きなIssueとして作成します。「ユーザー管理機能を持つブログアプリを作る」などです 。   

タスクを分解: その大きなIssueの本文に、チェックリスト形式で必要な機能（「ユーザー登録」「記事投稿」「記事一覧表示」など）を書き出します。これが最初のタスクリストになります 。   

プロジェクトボードに追加: 作成したIssueをGitHub Projectsのカンバンボードに追加し、「Todo」カラムに配置します 。   

開発フェーズ（コードを書く）

リポジトリを作成: GitHub上に新しいリポジトリを作成します。

初期開発: この段階ではブランチはmain（またはdevelop）一本で進めることが多いです。まずは基本的な土台（フレームワークの導入、ディレクトリ構成の決定など）を構築します。

コミット: ある程度キリの良いところでコミットを重ねていきます。

テストフェーズ（品質を保つ仕組みを作る）

自動テストを設定: GitHub Actionsを使い、「mainブランチにコードがプッシュされたら、自動でテストを実行する」というワークフローを設定します。これにより、今後の開発で土台が壊れていないかを常にチェックできます。

シナリオ2：機能追加（最も一般的な開発サイクル）
ここからがgit worktreeの真価が発揮される場面です。

計画フェーズ

Issueを作成: 追加したい機能（例：「記事にコメントを付ける機能」）をIssueとして作成します 。バグの可能性や仕様などを詳細に記述し、   

featureラベルを付けます。

プロジェクトボードで管理: 作成したIssue（#123とします）をGitHub Projectsのカンバンボードの「Todo」カラムに配置します。

開発フェーズ

作業場を準備 (git worktree): 今、別の作業をしていたとしても問題ありません。stashは不要です。ターミナルで以下のコマンドを実行し、新しい作業場を瞬時に用意します。

Bash

# feature/comment-function という新しいブランチを作り、
#../comment-work という新しいフォルダに展開する
git worktree add -b feature/comment-function../comment-work
開発に着手: cd../comment-workで新しい作業場に移動し、コーディングに集中します。

Issueと連携: コミットメッセージにIssue番号を含めることで、進捗を自動で連携させます 。   

Bash

git commit -m "feat: コメント投稿フォームを作成 #123"
レビュー＆テストフェーズ

プルリクエストを作成: 作業が終わったら、feature/comment-functionブランチをプッシュし、GitHub上でmainブランチへの**プルリクエスト（PR）**を作成します 。PRのタイトルや本文にもIssue番号を記載すると、関連性が一目瞭然になります 。   

自動テストを実行 (GitHub Actions): PRが作成されると、GitHub Actionsが自動的に起動し、この変更によって既存の機能が壊れていないかをテストします。

コードレビュー: 他のメンバー（あるいは未来の自分）がPRを見て、コードに対するフィードバックをコメントします。

修正: 指摘があれば、comment-workフォルダで修正し、再度プッシュします。PRは自動で更新されます。

マージ＆デプロイ

マージ: レビューで承認（Approve）され、すべてのテストが通ったら、PRをマージします。これで新機能がmainブランチに統合されます。

後片付け: 不要になった作業場とブランチを片付けます。

Bash

# まずはメインの作業場に戻る
cd../my-project 
# 作業場を削除
git worktree remove../comment-work
# ブランチを削除
git branch -d feature/comment-function
シナリオ3：バグ修正（緊急の割り込み作業）
git worktreeが最も輝くシナリオの一つです。

計画フェーズ

Issueを作成: 発見されたバグ（例：「特定の条件下でコメントが投稿できない」）をIssueとして作成します。再現手順などを詳しく書き、bugラベルと高い優先度を設定します。

開発フェーズ

割り込み作業の開始 (git worktree): あなたが「機能追加」の作業に集中している真っ最中でも、今の作業を一切中断する必要はありません。

Bash

# hotfix/comment-bug という新しいブランチをmainから作り、
#../bugfix-work というフォルダに展開する
git worktree add -b hotfix/comment-bug../bugfix-work main
修正作業: cd../bugfix-workでバグ修正用の作業場に移動し、迅速に修正を行います。コミットメッセージにはfix:という接頭辞とIssue番号を入れます。

Bash

git commit -m "fix: コメント投稿時の認証エラーを修正 #124"
レビュー＆テスト、マージ

ここからの流れは「機能追加」とほぼ同じです。PRを作成し、自動テストとレビューを経て、迅速にmainブランチにマージします。

まとめ
シナリオ	計画（どこで？）	開発（どうやって？）	レビュー（どうやって？）	テスト（いつ？）
新規開発	GitHub Issueで全体像を定義	mainブランチで土台を構築	不要	mainへのプッシュ時
機能追加	GitHub Issueでタスク化	git worktreeで独立した作業場を作成	Pull Requestで議論	PR作成・更新時
バグ修正	GitHub Issueで問題を報告	git worktreeで緊急避難的に作業場を作成	Pull Requestで迅速に確認	PR作成・更新時

Google スプレッドシートにエクスポート
この3つの流れを基本の型として持っておくことで、どんな状況でも迷うことなく、ADHDの特性を活かした柔軟でスピーディーな開発を進めることができるようになります。




1. 新規開発
   1. 計画フェーズ
      1. 概要
         1. どんなものを作るのかの仕様書を作ってすべてのタスクをissueを作成する
      2. 流れ
         1. リポジトリを作る
         2. 開発用ブランチを作る
         3. 仕様書を作成する
         4. タスクを一覧化する
         5. issueに記載する 
   2. 開発フェーズ
      1. 概要
         1. 計画で決まったissueを進めていき完成させる
      2. 流れ
         1. 開発用ブランチを起点に各issue用のブランチを作る
         2. 各issue用のブランチにcheckoutして開発を進める
         3. 開発完了後に〇〇する→ここがわからない
         4. 
   3. テストフェーズ
      1. 概要
         1. 開発完了した後にテストを実行する
      2. 流れ
         1. ここもわからない

2. 機能追加
   1. 計画フェーズ
   2. 開発フェーズ
   3. レビュー＆テストフェーズ
   4. マージ＆デプロイ

3. バグ修正
   1. 計画フェーズ
   2. 開発フェーズ
   3. レビュー＆テスト・マージ


# 新規開発ワークフロー 詳細設計書（再検討版）

## 1. 計画フェーズ：思考を外部化し、道筋を立てる

### 概要
このフェーズの目的は、頭の中にある漠然としたアイデアを、誰が見ても理解できる具体的なタスク群に変換し、外部システム（GitHub）に完全に記録することです。これにより、「何をすべきか」を記憶しておく必要がなくなります。

### 流れ

1. **リポジトリの作成**: GitHub上で、この新規プロジェクトのためのリポジトリを1つ作成します。

2. **ブランチ戦略の決定**:
   - `main` ブランチ：常にリリース可能な、安定したコードを置く場所とします
   - `develop` ブランチ：これから開発する機能や修正を統合していくための、中心的な開発用ブランチとします。mainブランチからこのdevelopブランチを作成します。

3. **仕様書の作成**:
   - リポジトリの README.md ファイルに、このプロジェクトが「何を」「なぜ」「誰のために」作るのか、という核心的な目的を書き出します。これがプロジェクトの憲法となり、モチベーションの源泉になります。

4. **タスクの洗い出しと分解**:
   - 仕様書を基に、プロジェクト完成に必要なタスクをすべて洗い出します。
   - 「ユーザー認証機能」のような大きなタスクは、「ログイン画面UI作成」「APIエンドポイント設計」「DBテーブル作成」のように、数時間〜1日で完了できるレベルまで細かく分解します。これは着手のハードルを劇的に下げます。

5. **全タスクのIssue化**:
   - 分解したタスクを一つ残らず、GitHubのIssueとして作成します。
   - 各Issueには、`feature`（機能追加）、`bug`（バグ）、`chore`（雑務）などのラベルを付け、整理します。
   - 作成したIssueはすべてGitHub Projectsのカンバンボードに追加し、「Todo」カラムに配置します。

## 2. 開発フェーズ：集中と柔軟性を両立させる

### 概要
計画フェーズで作成したIssue（指示書）に基づき、一つずつタスクをこなしていきます。ここではgit worktreeを最大限に活用し、集中を妨げることなく、興味の波に合わせた柔軟なタスク切り替えを実現します。

### 流れ

1. **Issueの選択**: GitHub Projectsのカンバンボードから、今日取り組むIssueを1つ選び、「進行中」カラムに移動させます。

2. **作業場の準備 (git worktree)**:
   - ターミナルでメインの作業フォルダ（developブランチがチェックアウトされている場所）にいることを確認します。
   - 取り組むIssue（例: #11）のために、以下のコマンドで新しい作業場（フォルダ）とブランチを瞬時に作成します。
   ```bash
   # developブランチを基に、feature/11-login-ui という新しいブランチを作り、
   # ../login-ui-work という新しいフォルダに展開する
   git worktree add -b feature/11-login-ui ../login-ui-work develop
   ```

3. **開発に着手**:
   - `cd ../login-ui-work` で新しい作業場に移動し、コーディングに集中します。元の作業フォルダのことは完全に忘れて大丈夫です。

4. **コミットとプッシュ**:
   - キリの良いところで、こまめにコミットします。コミットメッセージにIssue番号（#11）を入れると、自動でIssueと関連付けられます。
   ```bash
   git commit -m "feat: ログインフォームのUIコンポーネントを作成 #11"
   ```
   - 作業が完了したら、ブランチをリモートリポジトリにプッシュします。
   ```bash
   git push origin feature/11-login-ui
   ```

5. **プルリクエストの作成**（開発完了後の具体的なアクション）:
   - GitHub上で、今プッシュしたfeature/11-login-uiブランチからdevelopブランチへの**プルリクエスト（PR）**を作成します。
   - PRは「この変更を開発用ブランチに加えても良いですか？」というレビュー依頼です。
   - PRの説明欄に `Closes #11` と書くことで、このPRがマージされた時にIssue #11 が自動でクローズされるように設定します。

## 3. レビュー＆統合フェーズ（テストフェーズ）

### 概要
作成したプルリクエスト（PR）を通じて、変更内容が安全であることを確認し、開発の中心であるdevelopブランチに統合します。ここでの主役は自動化とコミュニケーションです。

### 流れ（テストフェーズの具体的な流れ）

1. **自動テストの実行 (GitHub Actions)**:
   - PRが作成されると、それをきっかけ（トリガー）にGitHub Actionsが自動的に起動します。
   - あらかじめ設定しておいたテスト（単体テスト、結合テストなど）が実行され、この変更によって既存の機能が壊れていないかがチェックされます。
   - 結果はPRページに「✔︎ All checks have passed」のように表示され、品質を客観的に保証します。

2. **コードレビュー**:
   - 他の開発者（あるいは未来の自分）がPRの「Files changed」タブを見て、コードの変更内容を確認します。
   - 「この変数名はもっと分かりやすい方が良い」「ここのロジックはもっとシンプルに書ける」といったフィードバックを、コードの特定の行に対してコメントします。

3. **フィードバック対応と修正**:
   - レビューコメントを受けたら、自分の作業場（../login-ui-workフォルダ）でコードを修正します。
   - 修正内容をコミットし、再度プッシュします。PRは自動的に最新の状態に更新され、GitHub Actionsによるテストも再実行されます。

4. **マージ**:
   - すべての自動テストが成功し、レビューで承認（Approve）されたら、PRページの「Merge pull request」ボタンを押します。
   - これで、あなたの変更が安全にdevelopブランチに統合されます。

5. **後片付け**:
   - developブランチに統合されたので、作業用のブランチと作業場は不要になります。メインの作業フォルダに戻り、以下のコマンドでクリーンアップします。
   ```bash
   # メインの作業場に戻る
   cd ../my-project
   
   # 不要になった作業場を削除
   git worktree remove ../login-ui-work
   
   # 不要になったブランチをローカルとリモートから削除
   git branch -d feature/11-login-ui
   git push origin --delete feature/11-login-ui
   ```

この一連の流れを繰り返すことで、一つ一つのタスクを確実にこなしながら、プロジェクト全体を着実に完成へと導くことができます。

## worktreeを使った並行作業の管理

### 重要な原則：基本的にすべてのブランチ作成はworktreeで行う

**なぜworktreeを使うべきか：**
- 現在の作業を一切中断せずに新しいブランチで作業開始できる
- stashやcommitを強制されない
- 複数の作業を自然に並行して進められる
- 心理的な切り替えコストがゼロ

**推奨ワークフロー：**
```bash
# ブランチを作る時は常にworktree
git worktree add -b feature/新機能 ../新機能-work develop

# 例外：worktreeを使わない場合
# - リポジトリを初めてcloneした直後
# - README.mdのtypo修正などごく簡単な修正
```

### 複数のIssueを同時に進める場合の具体例

- Issue #11: ログイン機能を作っている途中
- Issue #12: 急にバグ修正が必要になった  
- Issue #13: UIの改善アイデアが浮かんだ

```bash
# 現在の作業状況
../my-project/        # developブランチ（メイン作業場）
../login-work/        # Issue #11用（feature/11-login）
../bugfix-work/       # Issue #12用（hotfix/12-auth-error）
../ui-improve-work/   # Issue #13用（feature/13-ui-improvement）

# 作業場間の移動は単純にcdするだけ
cd ../bugfix-work     # バグ修正に切り替え
cd ../login-work      # ログイン機能に戻る
```

それぞれの作業場は完全に独立しているので、コミットしていない変更があっても問題なく切り替えられます。

# 機能追加ワークフロー 詳細設計書

## 概要
既存のプロジェクトに新しい機能を追加する際の標準的なワークフローです。これはgit worktreeの真価が最も発揮される場面で、複数の機能開発を並行して進めながら、高品質なコードを維持できます。

## 1. 計画フェーズ：アイデアを具体的なタスクに変換

### 概要
新機能のアイデアや要望を、実装可能な具体的なタスクとして定義し、GitHubのIssueとして記録します。

### 流れ

1. **機能要件の明確化**:
   - 何を作るのか（What）：ユーザーが実現したいこと
   - なぜ必要なのか（Why）：ビジネス価値や問題解決
   - どのように使われるのか（How）：ユーザーストーリー

2. **Issueの作成**:
   ```markdown
   タイトル: [Feature] コメント機能の実装
   
   ## 概要
   記事にコメントを投稿できる機能を追加する
   
   ## 要件
   - [ ] コメント投稿フォーム
   - [ ] コメント一覧表示
   - [ ] コメントの削除機能（投稿者のみ）
   
   ## 技術的な検討事項
   - DBスキーマの追加（commentsテーブル）
   - APIエンドポイント（POST /api/comments, GET /api/posts/:id/comments）
   - フロントエンドコンポーネント
   
   ## 受け入れ条件
   - ユーザーがコメントを投稿できる
   - 投稿されたコメントが即座に表示される
   - 自分のコメントは削除できる
   ```

3. **ラベルとプロジェクトボードへの追加**:
   - `feature` ラベルを付ける
   - 優先度（`priority: high/medium/low`）を設定
   - GitHub Projectsの「Todo」カラムに配置

4. **タスクの分解**（必要に応じて）:
   - 大きな機能は、サブタスクとして別のIssueに分割
   - 例：「コメントUI実装 #25」「コメントAPI実装 #26」

## 2. 開発フェーズ：効率的な実装とコミット戦略

### 概要
worktreeを活用して、他の作業を妨げることなく新機能の開発に集中します。

### 流れ

1. **最新のdevelopブランチを取得**:
   ```bash
   # メイン作業場でdevelopを最新に
   cd ../my-project
   git checkout develop
   git pull origin develop
   ```

2. **機能用の作業場を作成**:
   ```bash
   # Issue #24 のコメント機能用
   git worktree add -b feature/24-comment ../comment-work develop
   cd ../comment-work
   ```

3. **開発の進め方**:
   - **小さなコミットを重ねる**：機能的な単位でこまめにコミット
   - **コミットメッセージの規則**：
     ```bash
     # 機能追加
     git commit -m "feat: コメント投稿フォームのUIを作成 #24"
     
     # リファクタリング
     git commit -m "refactor: コメント投稿処理を関数に切り出し #24"
     
     # テスト追加
     git commit -m "test: コメント投稿APIのテストを追加 #24"
     ```

4. **定期的なプッシュ**:
   ```bash
   # 作業の区切りでリモートにプッシュ（バックアップ兼進捗共有）
   git push origin feature/24-comment
   ```

5. **他の作業への切り替え**（必要に応じて）:
   ```bash
   # 急なバグ修正が必要になったら
   cd ../my-project
   git worktree add -b hotfix/25-urgent ../hotfix-work develop
   cd ../hotfix-work
   # バグ修正...
   
   # コメント機能に戻る
   cd ../comment-work
   # 作業継続（何も失われていない！）
   ```

## 3. レビュー＆テストフェーズ：品質保証と知識共有

### 概要
プルリクエストを通じて、コードの品質を保証し、チーム内での知識共有を促進します。

### 流れ

1. **セルフレビュー**（PR作成前）:
   ```bash
   # 自分の変更を確認
   git diff develop...HEAD
   
   # 不要なデバッグコードやコメントを削除
   # コードフォーマットを整える
   ```

2. **プルリクエストの作成**:
   ```markdown
   タイトル: feat: コメント機能を実装 #24
   
   ## 概要
   記事にコメントを投稿・表示する機能を実装しました。
   
   ## 変更内容
   - コメント投稿フォームコンポーネント
   - コメント一覧表示コンポーネント
   - コメントAPI（POST/GET/DELETE）
   - DBマイグレーション（commentsテーブル）
   
   ## テスト方法
   1. 記事詳細ページを開く
   2. コメントフォームに入力して投稿
   3. コメントが表示されることを確認
   4. 自分のコメントの削除ボタンで削除できることを確認
   
   ## スクリーンショット
   [コメント機能のスクリーンショット]
   
   Closes #24
   ```

3. **自動テストとCI/CD**:
   - GitHub Actionsが自動で起動
   - ユニットテスト、統合テスト、Lintが実行される
   - テスト結果がPRに表示される

4. **コードレビューのポイント**:
   - **設計の妥当性**：アーキテクチャに沿っているか
   - **コードの可読性**：他の人が理解しやすいか
   - **テストの充実度**：エッジケースがカバーされているか
   - **パフォーマンス**：N+1問題などがないか
   - **セキュリティ**：SQLインジェクション対策など

5. **フィードバック対応**:
   ```bash
   # レビューコメントに基づいて修正
   cd ../comment-work
   # 修正作業...
   
   git commit -m "fix: レビュー指摘事項を修正（変数名を明確化） #24"
   git push origin feature/24-comment
   ```

## 4. マージ＆デプロイフェーズ：安全な統合と後処理

### 概要
承認された変更を安全にdevelopブランチに統合し、作業環境をクリーンアップします。

### 流れ

1. **最終確認**:
   - すべてのテストがパスしている
   - レビューで「Approved」を得ている
   - コンフリクトが解決されている

2. **マージ戦略の選択**:
   - **Squash and merge**：コミット履歴をきれいにしたい場合
   - **Create a merge commit**：詳細な履歴を残したい場合
   - **Rebase and merge**：直線的な履歴にしたい場合（上級者向け）

3. **マージ実行**:
   - GitHubのPRページで「Merge pull request」をクリック
   - Issue #24 が自動的にクローズされる

4. **作業場のクリーンアップ**:
   ```bash
   # メイン作業場に戻る
   cd ../my-project
   
   # developを最新に更新
   git checkout develop
   git pull origin develop
   
   # 不要になった作業場を削除
   git worktree remove ../comment-work
   
   # ローカルブランチを削除
   git branch -d feature/24-comment
   
   # リモートブランチを削除（任意）
   git push origin --delete feature/24-comment
   ```

5. **次のタスクへ**:
   - GitHub Projectsで次のIssueを選択
   - 新しいworktreeで作業開始

## ベストプラクティス

### コミット戦略
- **頻度**：30分〜1時間に1回はコミット
- **粒度**：1つのコミットは1つの変更
- **メッセージ**：何を変更したか、なぜ変更したかを明確に

### ブランチ名の規則
```bash
feature/{issue番号}-{簡潔な説明}
# 例：feature/24-comment
#     feature/25-user-profile
#     feature/26-search-api
```

### worktreeの整理
```bash
# 現在のworktreeを確認
git worktree list

# 使わなくなったworktreeを定期的に削除
git worktree prune
```

### 並行作業のコツ
- 各worktreeのターミナルタブに分かりやすい名前を付ける
- VSCodeなどのエディタで各worktreeを別ウィンドウで開く
- 作業中のIssue番号をプロンプトに表示する

# バグ修正ワークフロー 詳細設計書

## 概要
本番環境や開発中に発見されたバグを迅速かつ安全に修正するワークフローです。git worktreeを活用することで、現在の作業を中断することなく、緊急のバグ修正に対応できます。

## バグの分類と対応戦略

### バグの緊急度による分類
1. **Critical（緊急）**: 本番環境でサービスが停止、データ損失の危険性
   - 対応：mainブランチから直接hotfixブランチを作成
   - 目標修正時間：即座〜数時間以内

2. **High（高）**: 主要機能が動作しない、多くのユーザーに影響
   - 対応：developブランチからbugfixブランチを作成
   - 目標修正時間：24時間以内

3. **Medium（中）**: 特定の条件下でのみ発生、回避策あり
   - 対応：developブランチからbugfixブランチを作成
   - 目標修正時間：次のリリースまで

4. **Low（低）**: UIの小さな不具合、影響が限定的
   - 対応：通常の機能追加と同じ扱い
   - 目標修正時間：バックログで管理

## 1. 計画フェーズ：バグの記録と分析

### 概要
バグを正確に記録し、再現可能な形で文書化します。これにより、修正の効率と品質が大幅に向上します。

### 流れ

1. **バグの報告を受ける**:
   - ユーザーからの報告
   - 監視システムからのアラート
   - 開発中の発見

2. **Issueの作成**:
   ```markdown
   タイトル: [Bug] ログイン時に特定条件でエラーが発生する
   
   ## バグの概要
   メールアドレスに「+」記号が含まれる場合、ログインできない
   
   ## 再現手順
   1. ログインページにアクセス
   2. メールアドレス「user+test@example.com」を入力
   3. 正しいパスワードを入力
   4. ログインボタンをクリック
   
   ## 期待される動作
   正常にログインでき、ダッシュボードが表示される
   
   ## 実際の動作
   「Invalid email format」エラーが表示される
   
   ## 環境
   - ブラウザ: Chrome 120.0
   - OS: Windows 11
   - 発生環境: 本番環境
   
   ## エラーログ
   ```
   Error: Email validation failed
   at validateEmail (auth.js:45)
   at login (auth.js:123)
   ```
   
   ## 影響範囲
   - 影響を受けるユーザー数: 約100名（推定）
   - 業務への影響: ログインできないため、サービスが利用不可
   
   ## 優先度
   High - 多くのユーザーがログインできない
   ```

3. **ラベルとアサイン**:
   - `bug` ラベルを付ける
   - 優先度ラベル（`priority: critical/high/medium/low`）
   - 必要に応じて担当者をアサイン

4. **原因の初期分析**:
   - エラーログの確認
   - 関連するコードの特定
   - 最近の変更履歴の確認

## 2. 開発フェーズ：迅速な修正と検証

### 概要
worktreeを使って現在の作業を保持したまま、バグ修正に集中します。

### 流れ

1. **修正用の作業場を作成**:
   ```bash
   # 通常のバグ（developから分岐）
   cd ../my-project
   git worktree add -b bugfix/27-login-validation ../bugfix-login develop
   cd ../bugfix-login
   
   # 緊急のバグ（mainから分岐）
   git worktree add -b hotfix/28-critical-auth ../hotfix-auth main
   cd ../hotfix-auth
   ```

2. **バグの再現**:
   ```bash
   # テスト環境でバグを再現
   # 自動テストを書いて、バグの存在を確認
   npm test -- --grep "email with plus sign"  # 失敗することを確認
   ```

3. **修正の実装**:
   - **最小限の変更**: バグ修正に必要な最小限の変更に留める
   - **テストファースト**: まず失敗するテストを書き、それをパスするように修正
   ```bash
   # テストを追加
   git add test/auth.test.js
   git commit -m "test: メールアドレスに+記号を含む場合のテストを追加 #27"
   
   # バグを修正
   git add src/auth.js
   git commit -m "fix: メールアドレスの+記号を正しく処理するように修正 #27"
   ```

4. **修正の検証**:
   ```bash
   # すべてのテストが通ることを確認
   npm test
   
   # 手動でも動作確認
   npm run dev
   # ブラウザで実際に「user+test@example.com」でログインを試す
   ```

5. **関連する箇所の確認**:
   ```bash
   # 同じバグが他の箇所にないか確認
   grep -r "validateEmail" src/
   
   # 影響範囲の確認
   git diff develop...HEAD
   ```

## 3. レビュー＆テストフェーズ：品質保証と再発防止

### 概要
バグ修正の品質を保証し、同様のバグの再発を防ぐための対策を実施します。

### 流れ

1. **プルリクエストの作成**:
   ```markdown
   タイトル: fix: メールアドレスの+記号を正しく処理 #27
   
   ## 修正内容
   メールアドレスに「+」記号が含まれる場合にログインできない問題を修正しました。
   
   ## 原因
   メールバリデーションの正規表現が「+」記号を許可していなかった
   
   ## 修正方法
   - 正規表現を修正し、RFC 5322準拠のメールアドレスを受け入れるように変更
   - 該当するテストケースを追加
   
   ## テスト
   - [x] ユニットテストを追加（+記号を含むメールアドレス）
   - [x] 手動テスト完了
   - [x] 既存のテストがすべてパス
   
   ## 確認項目
   - [x] user+test@example.com でログインできる
   - [x] 通常のメールアドレスでも引き続きログインできる
   - [x] 不正なメールアドレスは適切に拒否される
   
   Fixes #27
   ```

2. **緊急度に応じたレビュープロセス**:
   - **Critical**: 最小限のレビュー後、即座にマージ
   - **High**: 通常のレビュープロセス（ただし優先的に）
   - **Medium/Low**: 通常のレビュープロセス

3. **回帰テストの実施**:
   ```bash
   # 影響を受ける可能性のある機能のテスト
   npm test -- --grep "authentication"
   npm test -- --grep "user registration"
   ```

4. **根本原因分析**（RCA）:
   - なぜこのバグが発生したか
   - なぜテストで検出できなかったか
   - 今後の予防策は何か

## 4. マージ＆デプロイフェーズ：安全なリリースと事後対応

### 概要
修正を本番環境に安全にデプロイし、問題が解決されたことを確認します。

### 流れ

1. **マージ戦略**:
   ```bash
   # 通常のバグ修正（develop → main）
   # 1. developにマージ
   # 2. 次回リリース時にmainへ
   
   # 緊急のバグ修正（hotfix → main & develop）
   # 1. mainに直接マージ
   # 2. 即座にdevelopにもマージ（同期を保つ）
   ```

2. **デプロイ前の最終確認**:
   - ステージング環境でのテスト
   - ロールバック計画の確認
   - 関係者への通知

3. **デプロイ実行**:
   ```bash
   # タグを作成（緊急修正の場合）
   git tag -a v1.2.1 -m "Hotfix: Email validation fix"
   git push origin v1.2.1
   
   # デプロイ（CI/CDまたは手動）
   ```

4. **デプロイ後の確認**:
   - 本番環境での動作確認
   - エラーログの監視
   - ユーザーからのフィードバック確認

5. **作業場のクリーンアップ**:
   ```bash
   # メイン作業場に戻る
   cd ../my-project
   
   # ブランチを最新に
   git checkout develop
   git pull origin develop
   
   # 作業場を削除
   git worktree remove ../bugfix-login
   
   # ブランチを削除
   git branch -d bugfix/27-login-validation
   git push origin --delete bugfix/27-login-validation
   ```

6. **事後対応**:
   - 影響を受けたユーザーへの通知
   - ポストモーテム（重大なバグの場合）
   - 再発防止策の実装

## ベストプラクティス

### バグ修正の原則
- **修正は最小限に**: バグ修正時にリファクタリングしない
- **テストファースト**: 必ずテストを書いてからバグを修正
- **根本原因を修正**: 症状ではなく原因を修正する

### コミットメッセージ
```bash
# バグ修正
git commit -m "fix: [影響範囲] 具体的な修正内容 #issue番号"

# 例
git commit -m "fix: ログイン時のメールバリデーションエラーを修正 #27"
git commit -m "fix: APIレスポンスのnullチェックを追加 #28"
```

### 緊急対応時の心得
1. **パニックにならない**: worktreeがあるので現在の作業は安全
2. **手順を守る**: 緊急時こそ手順が重要
3. **コミュニケーション**: 進捗を適時共有
4. **記録を残す**: 後で振り返れるように

### バグの再発防止
- 同じパターンのバグを自動検出するlintルールの追加
- テストケースの充実
- コードレビューのチェックリスト更新
- ドキュメントの改善

# Conventional Commits - 標準化されたコミットメッセージ

## 概要
Conventional Commitsは、コミットメッセージに意味のある接頭辞（type）を付けることで、変更の意図を明確にし、自動化を可能にする規約です。

## 基本構造
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## 主要なtype

### 基本的なtype
- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードスタイルの変更（フォーマット、セミコロンなど）
- **refactor**: バグ修正や機能追加を伴わないコードの変更
- **test**: テストの追加・修正
- **chore**: ビルドプロセスや補助ツールの変更

### 実例
```bash
# 新機能
git commit -m "feat: ユーザープロフィール画面を追加 #15"
git commit -m "feat(auth): JWTトークンによる認証を実装"

# バグ修正
git commit -m "fix: ログイン時のメールバリデーションエラーを修正 #27"
git commit -m "fix(api): nullレスポンスのハンドリングを追加"

# ドキュメント
git commit -m "docs: READMEにインストール手順を追加"
git commit -m "docs(api): エンドポイントの説明を更新"

# リファクタリング
git commit -m "refactor: 認証ロジックを別モジュールに分離"
git commit -m "refactor(utils): 日付処理関数を統合"

# テスト
git commit -m "test: ユーザー登録のE2Eテストを追加"
git commit -m "test(unit): バリデーション関数のテストケースを追加"

# 破壊的変更（重要）
git commit -m "feat!: APIのレスポンス形式を変更"
git commit -m "fix!: 認証方式をセッションからJWTに変更"
```

## メリット

1. **履歴の可読性向上**: `git log --oneline`で変更の種類が一目瞭然
2. **自動化**: 
   - CHANGELOGの自動生成
   - セマンティックバージョニング（major.minor.patch）の自動更新
   - 特定typeのコミットに対するCI/CDトリガー
3. **コミットの規律**: 1コミット1目的の原則が自然に身につく

## worktreeワークフローとの統合

```bash
# Issue #30のユーザー設定機能を開発
git worktree add -b feature/30-user-settings ../settings-work develop
cd ../settings-work

# 開発を進めながら、目的別にコミット
git commit -m "feat: ユーザー設定画面のUIを作成 #30"
git commit -m "feat: 設定保存APIエンドポイントを追加 #30"
git commit -m "test: 設定保存機能のテストを追加 #30"
git commit -m "docs: 設定機能のAPI仕様を記載 #30"
```

# GitHub Copilotによる開発効率化

## セットアップ
1. VS CodeにGitHub Copilot拡張機能をインストール
2. GitHub Copilot Chat拡張機能もインストール（対話型支援用）

## 主要な活用シーン

### 1. コード補完とインライン生成
```javascript
// コメントを書くだけで実装を生成
// ユーザーのメールアドレスをバリデートする関数
function validateEmail(email) {
  // Copilotが正規表現とバリデーションロジックを提案
}
```

### 2. インラインチャット（Cmd+I / Ctrl+I）
コードを選択して、自然言語で指示：
- 「このコードをTypeScriptに変換して」
- 「エラーハンドリングを追加して」
- 「より効率的に書き直して」

### 3. チャットビュー（サイドパネル）
より複雑な質問や、プロジェクト全体に関する相談：
- 「このプロジェクトの認証フローを説明して」
- 「新しいAPIエンドポイントを追加する手順は？」

### 4. スラッシュコマンド
- `/explain`: 選択したコードの説明
- `/tests`: ユニットテストの自動生成
- `/fix`: バグの修正提案
- `/optimize`: パフォーマンス改善の提案

### 5. エージェント
- `@workspace`: プロジェクト全体を理解した上での回答
- `@vscode`: VS Codeの使い方に関する質問

## 実践的な使用例

### Issue駆動開発での活用
```markdown
# GitHub Issueの内容をCopilotに渡す
「Issue #35: ユーザー検索機能を実装する。メールアドレスまたは名前で検索可能にする」

# Copilotへの指示
@workspace この機能を実装するために必要なファイルと手順を教えて
```

### テスト駆動開発（TDD）での活用
```javascript
// 1. まずテストを書く（Copilotが補完）
describe('UserSearch', () => {
  it('should find users by email', async () => {
    // Copilotがテストケースを提案
  });
});

// 2. 実装を生成
// Copilot: 「このテストをパスする実装を作成して」
```

### コミットメッセージの生成
VS Codeのソース管理パネルで、Copilotアイコンをクリックして変更内容に基づいたConventional Commits形式のメッセージを生成。

# GitHub Actions - CI/CD自動化

## 基本的なCI/CDパイプライン

### 1. 継続的インテグレーション（CI）
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ develop, 'feature/**' ]
  pull_request:
    branches: [ develop, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build
      run: npm run build
```

### 2. 自動デプロイ（CD）
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install and Build
      run: |
        npm ci
        npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 3. 自動Issue管理
```yaml
# .github/workflows/issue-automation.yml
name: Issue Automation

on:
  pull_request:
    types: [opened, closed]

jobs:
  update-issue:
    runs-on: ubuntu-latest
    
    steps:
    - name: Move issue to In Progress
      if: github.event.action == 'opened'
      uses: peter-evans/create-or-update-project-card@v2
      with:
        project-name: Development
        column-name: In Progress
        issue-number: ${{ github.event.pull_request.number }}
    
    - name: Close linked issues
      if: github.event.pull_request.merged == true
      uses: peter-evans/close-issue@v2
      with:
        issue-number: ${{ github.event.pull_request.number }}
        comment: Completed in PR #${{ github.event.pull_request.number }}
```

### 4. 依存関係の自動更新
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "automated"
```

## worktreeワークフローとの統合

1. **feature/**ブランチへのpush** → CI実行
2. **PRの作成** → テスト実行 + Issueステータス更新
3. **developへのマージ** → ステージング環境へのデプロイ
4. **mainへのマージ** → 本番環境へのデプロイ

# Alternative: Jujutsu (jj) を使った革新的アプローチ

## 概要
Jujutsuは「ワーキングコピーは常にコミット」という革新的な思想のVCSです。GitHubとの完全互換性を保ちながら、ローカル開発体験を劇的に改善します。

## 主な特徴

### 1. ステージングエリアが不要
```bash
# Gitの場合
git add file.js
git commit -m "feat: 新機能追加"

# jjの場合（ファイルを保存した時点で自動的にコミットに含まれる）
jj describe -m "feat: 新機能追加"
```

### 2. git stashが不要
```bash
# 別の作業を始めたい時
# Gitの場合
git stash
git checkout -b other-feature

# jjの場合（現在の作業は自動的に保存される）
jj new -m "feat: 別の機能"
```

### 3. 直感的な履歴編集
```bash
# 過去のコミットを修正
jj edit <change-id>
# ファイルを修正
jj edit @  # 最新に戻る（間のコミットは自動リベース）
```

### 4. 強力なundo
```bash
# どんな操作も一発で取り消し
jj undo
```

## GitHubワークフローとの統合

```bash
# 1. 既存のGitリポジトリでjjを使用開始
cd my-project
jj git init --colocate

# 2. 新機能の開発
jj new -m "feat: ユーザー認証機能 #40"
# コーディング...

# 3. コミットの分割（必要に応じて）
jj split

# 4. GitHubにプッシュ
jj bookmark create feature/40-auth
jj git push --bookmark feature/40-auth

# 5. GitHub上でPR作成（通常通り）
```

## worktreeとjjの使い分け

| 状況 | worktree | jj |
|-----|----------|-----|
| チーム開発 | ◎（Gitの知識で十分） | △（チーム全体の学習が必要） |
| 個人開発 | ○（並行作業に最適） | ◎（最高の開発体験） |
| 複雑な履歴操作 | △（rebaseが面倒） | ◎（直感的） |
| GitHub統合 | ◎（完全にGit） | ○（変換が必要） |

## まとめ

現在のworktreeベースのワークフローは十分に効率的ですが、以下の追加により更に強化されます：

1. **Conventional Commits**: 履歴の可読性と自動化
2. **GitHub Copilot**: AI支援による高速開発
3. **GitHub Actions**: 完全自動化されたCI/CD
4. **Jujutsu（オプション）**: 究極のローカル開発体験

これらを段階的に導入することで、個人開発の生産性を最大化できます。

# 新規開発ワークフロー 詳細設計書（jj版）

## 概要
Jujutsu（jj）を使用した新規開発ワークフローです。「ワーキングコピーは常にコミット」という革新的な思想により、git stashやステージングエリアの概念から解放され、よりシンプルで直感的な開発体験を実現します。

## 1. 計画フェーズ：思考を外部化し、道筋を立てる

### 概要
基本的にはGit版と同じです。GitHubのIssueとProjectsを使ってタスクを管理します。

### 流れ

1. **リポジトリの作成**: GitHub上でリポジトリを作成し、ローカルにクローン

2. **jjの初期化**:
   ```bash
   # Gitリポジトリでjjを使用開始
   cd my-project
   jj git init --colocate
   ```

3. **ブランチ戦略**:
   - jjでは「ブランチ」の概念が薄く、「変更（change）」が中心
   - GitHubとの互換性のため、mainとdevelopの概念は維持
   - ただし、ローカルではブックマークとして管理

4. **仕様書の作成**: README.mdに記載（Git版と同じ）

5. **全タスクのIssue化**: GitHub上で管理（Git版と同じ）

## 2. 開発フェーズ：摩擦のない開発体験

### 概要
jjの真価が発揮されるフェーズです。ステージングやstashを意識することなく、自然な流れで開発を進められます。

### 流れ

1. **Issueの選択**: GitHub Projectsから取り組むIssueを選択

2. **新しい変更の開始**:
   ```bash
   # mainの最新から新しい変更を開始
   jj new main -m "feat: ログイン機能を実装 #11"
   ```
   - ブランチ名を考える必要なし
   - 即座に作業開始可能

3. **開発の進行**:
   ```bash
   # ファイルを編集すると自動的に現在の変更に含まれる
   # エディタでlogin.jsを編集
   
   # 現在の差分を確認
   jj diff
   
   # 変更の説明を更新（git commit --amendに相当）
   jj describe -m "feat: ログインフォームのUIを追加 #11"
   ```

4. **作業の中断と再開**（jjの最大の利点）:
   ```bash
   # 急にバグ修正が必要になった場合
   # 現在の作業は自動的に保存されているので、単に新しい変更を開始
   jj new main -m "fix: 認証エラーの修正 #12"
   
   # バグ修正...
   
   # ログイン機能に戻りたい時
   jj edit <ログイン機能のchange-id>
   # または、jj logで履歴を見て選択
   ```

5. **コミットの整理**:
   ```bash
   # 大きすぎる変更を分割
   jj split
   
   # 複数の変更を1つに統合
   jj squash
   
   # 過去の変更を修正（超簡単！）
   jj edit <過去のchange-id>
   # ファイルを修正
   jj edit @  # 最新に戻る（自動リベース）
   ```

6. **GitHubへの共有準備**:
   ```bash
   # GitHub用のブックマーク（ブランチ）を作成
   jj bookmark create feature/11-login
   
   # リモートにプッシュ
   jj git push --bookmark feature/11-login
   ```

## 3. レビュー＆統合フェーズ

### 概要
GitHub上でのプロセスは従来と同じですが、レビューフィードバックへの対応がjjでは格段に簡単になります。

### 流れ

1. **Pull Request作成**: GitHub上で通常通りPRを作成

2. **自動テスト**: GitHub Actionsが実行（Git版と同じ）

3. **フィードバック対応**（jjの利点）:
   ```bash
   # レビューで「3つ前のコミットのタイポ」を指摘された場合
   
   # 該当のコミットに直接ジャンプ
   jj edit <3つ前のchange-id>
   
   # タイポを修正
   
   # 最新に戻る（間のコミットは自動的にリベース！）
   jj edit @
   
   # 更新をプッシュ（自動的にforce-push）
   jj git push --bookmark feature/11-login
   ```

4. **マージ**: GitHub上でPRをマージ

5. **後片付け**:
   ```bash
   # ローカルの状態を更新
   jj git fetch
   
   # 不要になったブックマークを削除
   jj bookmark delete feature/11-login
   
   # mainを最新に
   jj new main
   ```

## jj特有の便利な操作

### 1. 実験的な変更
```bash
# 実験的なアプローチを試したい
jj new -m "実験: 新しいアルゴリズム"

# うまくいかなかった場合
jj abandon @  # この変更を破棄
# 自動的に前の変更に戻る
```

### 2. 並行作業の可視化
```bash
# 現在進行中の全ての作業を確認
jj log

# グラフィカルに表示
jj log --graph
```

### 3. 究極のセーフティネット
```bash
# どんな操作もやり直し可能
jj undo  # 直前の操作を取り消し
jj op log  # 操作履歴を確認
jj op restore <operation-id>  # 特定の時点に戻る
```

## worktreeワークフローとの比較

| 観点 | worktree | jj |
|------|----------|-----|
| 作業の切り替え | 物理的にフォルダを移動 | 論理的に変更を切り替え |
| 並行作業の管理 | 複数のフォルダ | 1つのフォルダ内で完結 |
| 学習コスト | Gitの延長線上 | 新しい概念の理解が必要 |
| ディスク使用量 | 作業数×リポジトリサイズ | 1リポジトリ分のみ |
| 作業の可視性 | lsコマンドで確認 | jj logで確認 |

## まとめ

jjを使った新規開発ワークフローの特徴：

1. **ブランチ管理からの解放**: ブランチ名を考える必要なし
2. **stash不要**: 作業の中断・再開が自然
3. **履歴編集が簡単**: 過去のコミット修正が直感的
4. **安全性**: すべての操作がundo可能

特に個人開発や小規模チームでは、jjの「摩擦のない」開発体験により、創造的な作業により集中できるようになります。