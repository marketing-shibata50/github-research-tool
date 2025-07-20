// Personal Task Manager - GitHub学習用JavaScript

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskIdCounter = this.getNextTaskId();
        this.initializeApp();
    }

    // アプリケーション初期化
    initializeApp() {
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.setupDragAndDrop();
    }

    // イベントリスナー設定
    setupEventListeners() {
        // タスク追加フォーム
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // フィルタ変更
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('priorityFilter').addEventListener('change', () => this.applyFilters());

        // タスク操作（イベント委譲）
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editTask(e.target.closest('.task-card').dataset.taskId);
            }
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(e.target.closest('.task-card').dataset.taskId);
            }
        });
    }

    // タスク追加
    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const category = document.getElementById('taskCategory').value;
        const priority = document.getElementById('taskPriority').value;

        if (!title) {
            alert('タスクタイトルを入力してください');
            return;
        }

        const task = {
            id: this.taskIdCounter++,
            title,
            description,
            category,
            priority,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.clearForm();

        // GitHub風の成功メッセージ（実際のGitHubではIssue作成時に表示される）
        this.showNotification(`タスク #${task.id} を作成しました`, 'success');
    }

    // タスク編集
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === parseInt(taskId));
        if (!task) return;

        const newTitle = prompt('タスクタイトル:', task.title);
        if (newTitle === null) return;

        const newDescription = prompt('タスク説明:', task.description);
        if (newDescription === null) return;

        task.title = newTitle.trim();
        task.description = newDescription.trim();
        task.updatedAt = new Date().toISOString();

        this.saveTasks();
        this.renderTasks();
        this.showNotification(`タスク #${task.id} を更新しました`, 'info');
    }

    // タスク削除
    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === parseInt(taskId));
        if (!task) return;

        if (confirm(`タスク「${task.title}」を削除しますか？`)) {
            this.tasks = this.tasks.filter(t => t.id !== parseInt(taskId));
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification(`タスク #${task.id} を削除しました`, 'warning');
        }
    }

    // タスクレンダリング
    renderTasks() {
        const todoContainer = document.getElementById('todoTasks');
        const inProgressContainer = document.getElementById('inProgressTasks');
        const doneContainer = document.getElementById('doneTasks');

        // コンテナをクリア
        todoContainer.innerHTML = '';
        inProgressContainer.innerHTML = '';
        doneContainer.innerHTML = '';

        // フィルタリングされたタスクを取得
        const filteredTasks = this.getFilteredTasks();

        // 各タスクをレンダリング
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            
            switch (task.status) {
                case 'todo':
                    todoContainer.appendChild(taskElement);
                    break;
                case 'in-progress':
                    inProgressContainer.appendChild(taskElement);
                    break;
                case 'done':
                    doneContainer.appendChild(taskElement);
                    break;
            }
        });
    }

    // タスク要素作成
    createTaskElement(task) {
        const template = document.getElementById('taskTemplate');
        const taskElement = template.content.cloneNode(true);
        const taskCard = taskElement.querySelector('.task-card');

        taskCard.dataset.taskId = task.id;
        taskCard.dataset.status = task.status;

        // タスク情報を設定
        taskElement.querySelector('.task-id').textContent = `#${task.id}`;
        taskElement.querySelector('.task-title').textContent = task.title;
        taskElement.querySelector('.task-description').textContent = task.description || '説明なし';
        
        // 優先度設定
        const priorityElement = taskElement.querySelector('.task-priority');
        priorityElement.textContent = this.getPriorityLabel(task.priority);
        priorityElement.className = `task-priority ${task.priority}`;

        // カテゴリ設定
        const categoryElement = taskElement.querySelector('.task-category');
        categoryElement.textContent = this.getCategoryLabel(task.category);
        categoryElement.className = `task-category ${task.category}`;

        // 作成日時
        taskElement.querySelector('.task-created').textContent = 
            new Date(task.createdAt).toLocaleDateString('ja-JP');

        return taskElement;
    }

    // フィルタリング適用
    applyFilters() {
        this.renderTasks();
    }

    // フィルタリングされたタスク取得
    getFilteredTasks() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;

        return this.tasks.filter(task => {
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

            return matchesCategory && matchesStatus && matchesPriority;
        });
    }

    // 統計更新
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.status === 'done').length;
        const inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('inProgressCount').textContent = inProgressTasks;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }

    // ドラッグ&ドロップ設定
    setupDragAndDrop() {
        // タスクカードのドラッグ開始
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            }
        });

        // ドラッグ終了
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
            }
        });

        // ドロップゾーンの設定
        document.querySelectorAll('.task-column').forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });

            column.addEventListener('dragleave', (e) => {
                if (!column.contains(e.relatedTarget)) {
                    column.classList.remove('drag-over');
                }
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');

                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.dataset.status;
                this.updateTaskStatus(parseInt(taskId), newStatus);
            });
        });
    }

    // タスクステータス更新
    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        const oldStatus = task.status;
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();

        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // GitHub風のステータス更新メッセージ
        this.showNotification(
            `タスク #${taskId} を ${this.getStatusLabel(oldStatus)} から ${this.getStatusLabel(newStatus)} に移動しました`,
            'info'
        );
    }

    // ユーティリティ関数
    getPriorityLabel(priority) {
        const labels = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return labels[priority] || priority;
    }

    getCategoryLabel(category) {
        const labels = {
            'feature': '新機能',
            'bug': 'バグ',
            'improvement': '改善',
            'documentation': 'ドキュメント'
        };
        return labels[category] || category;
    }

    getStatusLabel(status) {
        const labels = {
            'todo': 'TODO',
            'in-progress': '進行中',
            'done': '完了'
        };
        return labels[status] || status;
    }

    // 通知表示（GitHub風）
    showNotification(message, type = 'info') {
        // 簡易的な通知実装
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background: #0366d6;
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        // タイプ別スタイル
        const colors = {
            'success': '#28a745',
            'warning': '#ffd33d',
            'error': '#d73a49',
            'info': '#0366d6'
        };
        if (colors[type]) {
            notification.style.background = colors[type];
        }

        document.body.appendChild(notification);

        // 3秒後に削除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // フォームクリア
    clearForm() {
        document.getElementById('addTaskForm').reset();
    }

    // データ永続化
    saveTasks() {
        localStorage.setItem('github-learning-tasks', JSON.stringify(this.tasks));
        localStorage.setItem('github-learning-task-counter', this.taskIdCounter.toString());
    }

    loadTasks() {
        const saved = localStorage.getItem('github-learning-tasks');
        return saved ? JSON.parse(saved) : [];
    }

    getNextTaskId() {
        const saved = localStorage.getItem('github-learning-task-counter');
        return saved ? parseInt(saved) : 1;
    }

    // デモデータ生成（学習用）
    generateSampleTasks() {
        const sampleTasks = [
            {
                id: this.taskIdCounter++,
                title: 'GitHub Issues の基本操作を学習',
                description: 'Issue の作成、編集、クローズの方法を実践で学ぶ',
                category: 'documentation',
                priority: 'high',
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.taskIdCounter++,
                title: 'Pull Request のワークフローを実践',
                description: 'ブランチ作成からマージまでの一連の流れを体験',
                category: 'feature',
                priority: 'high',
                status: 'in-progress',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.taskIdCounter++,
                title: 'GitHub Actions でCI/CDを設定',
                description: '自動テストとデプロイの仕組みを構築',
                category: 'improvement',
                priority: 'medium',
                status: 'todo',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        if (this.tasks.length === 0) {
            this.tasks = sampleTasks;
            this.saveTasks();
        }
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    
    // デモデータ生成（初回のみ）
    taskManager.generateSampleTasks();
    taskManager.renderTasks();
    taskManager.updateStats();

    // グローバルに公開（デバッグ用）
    window.taskManager = taskManager;
    
    console.log('🎯 Personal Task Manager が起動しました！');
    console.log('GitHub機能学習用のタスク管理アプリです。');
    console.log('タスクを追加して、GitHub の各機能を実践的に学習しましょう！');
});