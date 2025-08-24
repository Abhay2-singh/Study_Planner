// ===== AI STUDY PLANNER MAIN JAVASCRIPT =====

// Global variables
let currentTheme = 'light';
let notificationsEnabled = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing AI Study Planner');
    initializeApp();
    setupEventListeners();
    setupThemeToggle();
    setupNotifications();
    
    // Ensure quick actions are set up
    setTimeout(() => {
        console.log('Setting up quick actions with delay...');
        setupQuickActions();
    }, 100);
});

// Initialize the application
function initializeApp() {
    console.log('AI Study Planner initialized');
    
    // Check if user is authenticated
    const isAuthenticated = document.querySelector('.user-menu') !== null;
    
    if (isAuthenticated) {
        initializeDashboard();
        initializeCharts();
        setupTaskCompletion();
        setupSearchAndFilters();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation drawer toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navigationDrawer = document.getElementById('navigation-drawer');
    const mainContent = document.getElementById('main-content');
    
    if (menuToggle && navigationDrawer && mainContent) {
        menuToggle.addEventListener('click', function() {
            navigationDrawer.classList.toggle('navigation-drawer--open');
            mainContent.classList.toggle('main-content--drawer-open');
        });
    }
    
    // FAB menu toggle
    const fab = document.getElementById('fab');
    const fabMenu = document.getElementById('fab-menu');
    
    if (fab && fabMenu) {
        fab.addEventListener('click', function() {
            const isOpen = fabMenu.__x.$data.open;
            fabMenu.__x.$data.open = !isOpen;
        });
    }
    
    // Close navigation drawer when clicking outside
    document.addEventListener('click', function(event) {
        if (navigationDrawer && !navigationDrawer.contains(event.target) && !menuToggle.contains(event.target)) {
            navigationDrawer.classList.remove('navigation-drawer--open');
            mainContent.classList.remove('main-content--drawer-open');
        }
    });
    
    // Auto-dismiss flash messages
    setupFlashMessages();
}

// Setup flash messages
function setupFlashMessages() {
    const alerts = document.querySelectorAll('.alert--dismissible');
    
    alerts.forEach(alert => {
        const dismissBtn = alert.querySelector('.alert__dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                alert.remove();
            });
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    });
}

// Initialize dashboard functionality
function initializeDashboard() {
    console.log('AI Dashboard initialized');
    
    // Setup task completion
    setupTaskCompletion();
    
    // Setup progress tracking
    setupProgressTracking();
    
    // Setup quick actions
    setupQuickActions();
}

// Setup task completion functionality
function setupTaskCompletion() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.dataset.taskId;
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                completeTask(taskId, taskItem);
            } else {
                uncompleteTask(taskId, taskItem);
            }
        });
    });
}

// Complete a task
function completeTask(taskId, taskItem) {
    fetch(`/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            taskItem.classList.add('task-item--completed');
            showToast('Task completed!', 'success');
            updateProgress();
        }
    })
    .catch(error => {
        console.error('Error completing task:', error);
        showToast('Error completing task', 'error');
    });
}

// Uncomplete a task
function uncompleteTask(taskId, taskItem) {
    // Implementation for uncompleting tasks
    taskItem.classList.remove('task-item--completed');
    updateProgress();
}

// Setup progress tracking
function initializeCharts() {
    const progressChart = document.getElementById('progress-chart');
    if (progressChart) {
        createProgressChart(progressChart);
    }
    
    const studyTimeChart = document.getElementById('study-time-chart');
    if (studyTimeChart) {
        createStudyTimeChart(studyTimeChart);
    }
}

// Create progress chart
function createProgressChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'Overdue'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#F44336'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Create study time chart
function createStudyTimeChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Study Hours',
                data: [4, 3, 5, 2, 6, 4, 3],
                backgroundColor: '#2196F3',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 8,
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });
}

// Setup progress tracking
function setupProgressTracking() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.dataset.progress;
        animateProgressBar(bar, progress);
    });
}

// Animate progress bar
function animateProgressBar(bar, targetProgress) {
    let currentProgress = 0;
    const increment = targetProgress / 50;
    
    const animation = setInterval(() => {
        currentProgress += increment;
        bar.style.width = Math.min(currentProgress, targetProgress) + '%';
        
        if (currentProgress >= targetProgress) {
            clearInterval(animation);
        }
    }, 20);
}

// Setup quick actions
function setupQuickActions() {
    // Handle both quick-action class and data-action attributes
    const quickActionButtons = document.querySelectorAll('[data-action]');
    
    console.log('Found quick action buttons:', quickActionButtons.length);
    
    quickActionButtons.forEach(button => {
        console.log('Setting up button with action:', button.dataset.action);
        
        // Remove any existing event listeners
        button.removeEventListener('click', handleQuickActionClick);
        
        // Add new event listener
        button.addEventListener('click', handleQuickActionClick);
    });
}

// Handle quick action click
function handleQuickActionClick(event) {
    event.preventDefault();
    const action = this.dataset.action;
    console.log('Button clicked with action:', action);
    
    if (action) {
        handleQuickAction(action);
    }
}

// Handle quick actions
function handleQuickAction(action) {
    console.log('Handling quick action:', action);
    
    switch(action) {
        case 'add-task':
            window.location.href = '/tasks/new';
            break;
        case 'add-exam':
            window.location.href = '/tasks/exam/new';
            break;
        case 'start-pomodoro':
            startPomodoro();
            break;
        case 'view-calendar':
            window.location.href = '/calendar';
            break;
        case 'manage-subjects':
            window.location.href = '/tasks/subjects';
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Start Pomodoro timer
function startPomodoro() {
    // Create a simple Pomodoro timer modal
    const pomodoroModal = document.createElement('div');
    pomodoroModal.className = 'ai-pomodoro-modal';
    pomodoroModal.innerHTML = `
        <div class="ai-pomodoro-content">
            <div class="ai-pomodoro-header">
                <h3>🧠 AI Pomodoro Timer</h3>
                <button class="ai-pomodoro-close" onclick="this.closest('.ai-pomodoro-modal').remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="ai-pomodoro-timer">
                <div class="ai-pomodoro-display">
                    <span id="pomodoro-time">25:00</span>
                </div>
                <div class="ai-pomodoro-controls">
                    <button class="ai-btn ai-btn--primary" id="pomodoro-start">Start</button>
                    <button class="ai-btn ai-btn--secondary" id="pomodoro-pause">Pause</button>
                    <button class="ai-btn ai-btn--ghost" id="pomodoro-reset">Reset</button>
                </div>
            </div>
            <div class="ai-pomodoro-info">
                <p>Focus on your studies for 25 minutes, then take a 5-minute break.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(pomodoroModal);
    
    // Add Pomodoro timer functionality
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let timer = null;
    let isRunning = false;
    
    const timeDisplay = pomodoroModal.querySelector('#pomodoro-time');
    const startBtn = pomodoroModal.querySelector('#pomodoro-start');
    const pauseBtn = pomodoroModal.querySelector('#pomodoro-pause');
    const resetBtn = pomodoroModal.querySelector('#pomodoro-reset');
    
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    showToast('Pomodoro session completed! Take a break.', 'success');
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('AI Pomodoro', {
                            body: 'Study session completed! Time for a break.',
                            icon: '/static/favicon.ico'
                        });
                    }
                }
            }, 1000);
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
        }
    }
    
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60;
        updateDisplay();
    }
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Add CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
        .ai-pomodoro-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }
        
        .ai-pomodoro-content {
            background: var(--ai-surface-card);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: var(--ai-shadow-hover);
            border: 1px solid var(--ai-border);
            backdrop-filter: blur(20px);
        }
        
        .ai-pomodoro-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .ai-pomodoro-header h3 {
            margin: 0;
            color: var(--ai-text-primary);
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .ai-pomodoro-close {
            background: none;
            border: none;
            color: var(--ai-text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: var(--ai-transition);
        }
        
        .ai-pomodoro-close:hover {
            background: var(--ai-border);
            color: var(--ai-text-primary);
        }
        
        .ai-pomodoro-timer {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        
        .ai-pomodoro-display {
            font-size: 3rem;
            font-weight: 700;
            color: var(--ai-primary);
            margin-bottom: 1rem;
            font-family: 'Inter', monospace;
        }
        
        .ai-pomodoro-controls {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .ai-pomodoro-info {
            text-align: center;
            color: var(--ai-text-secondary);
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);
}

// Setup search and filters
function setupSearchAndFilters() {
    const searchInput = document.getElementById('search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilter);
    });
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const title = item.querySelector('.task-title').textContent.toLowerCase();
        const subject = item.querySelector('.task-subject').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || subject.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Handle filters
function handleFilter(event) {
    const filterType = event.target.dataset.filter;
    const filterValue = event.target.value;
    
    // Implementation for filtering tasks
    console.log('Filter applied:', filterType, filterValue);
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Toggle theme
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Set theme
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
}

// Setup notifications
function setupNotifications() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            notificationsEnabled = true;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                notificationsEnabled = permission === 'granted';
            });
        }
    }
}

// Show notification
function showNotification(title, options = {}) {
    if (notificationsEnabled) {
        new Notification(title, {
            icon: '/static/favicon.ico',
            badge: '/static/favicon.ico',
            ...options
        });
    }
}

// Show toast message
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `ai-toast ai-toast--${type}`;
    toast.innerHTML = `
        <span class="ai-toast__message">${message}</span>
        <button class="ai-toast__dismiss" type="button" aria-label="Dismiss">
            <span class="material-icons">close</span>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('ai-toast--show');
    }, 100);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        hideToast(toast);
    }, 3000);
    
    // Dismiss button
    const dismissBtn = toast.querySelector('.ai-toast__dismiss');
    dismissBtn.addEventListener('click', () => {
        hideToast(toast);
    });
    
    // Add CSS for toast if not already present
    if (!document.querySelector('#ai-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'ai-toast-styles';
        style.textContent = `
            .ai-toast {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--ai-surface-card);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: var(--ai-shadow-hover);
                border: 1px solid var(--ai-border);
                backdrop-filter: blur(20px);
                z-index: 1000;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .ai-toast--show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .ai-toast__message {
                color: var(--ai-text-primary);
                font-size: 0.875rem;
                flex: 1;
            }
            
            .ai-toast__dismiss {
                background: none;
                border: none;
                color: var(--ai-text-secondary);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: var(--ai-transition);
            }
            
            .ai-toast__dismiss:hover {
                background: var(--ai-border);
                color: var(--ai-text-primary);
            }
            
            .ai-toast--success {
                border-left: 4px solid #10b981;
            }
            
            .ai-toast--error {
                border-left: 4px solid #ef4444;
            }
            
            .ai-toast--warning {
                border-left: 4px solid #f59e0b;
            }
            
            .ai-toast--info {
                border-left: 4px solid var(--ai-primary);
            }
        `;
        document.head.appendChild(style);
    }
}

// Hide toast
function hideToast(toast) {
    toast.classList.remove('ai-toast--show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// Update progress
function updateProgress() {
    const completedTasks = document.querySelectorAll('.task-item--completed').length;
    const totalTasks = document.querySelectorAll('.task-item').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update progress display
    const progressDisplay = document.querySelector('.progress-display');
    if (progressDisplay) {
        progressDisplay.textContent = `${progress}%`;
    }
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Get CSRF token
function getCSRFToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to format dates
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// Utility function to format time
function formatTime(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(`2000-01-01T${time}`));
}

// Export functions for use in other scripts
window.StudyPlanner = {
    showToast,
    showNotification,
    setTheme,
    toggleTheme,
    formatDate,
    formatTime
};
