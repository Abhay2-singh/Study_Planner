import os
from datetime import timedelta

class Config:
    # Basic Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///study_planner.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Security Configuration
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour
    
    # Application Configuration
    STUDY_PLANNER_NAME = "Smart Study Planner"
    STUDY_PLANNER_VERSION = "1.0.0"
    
    # Pagination
    TASKS_PER_PAGE = 20
    EXAMS_PER_PAGE = 10
    
    # Notification Settings
    DEFAULT_NOTIFICATION_TIME = 15  # minutes before due date
    
    # Study Goals
    DEFAULT_STUDY_GOAL_HOURS = 4.0  # hours per day
    
    # Theme Settings
    DEFAULT_THEME = "light"
    AVAILABLE_THEMES = ["light", "dark"]
    
    # Color Palette (Material You)
    PRIMARY_COLORS = {
        'blue': '#2196F3',
        'green': '#4CAF50',
        'purple': '#9C27B0',
        'orange': '#FF9800',
        'red': '#F44336',
        'teal': '#009688',
        'indigo': '#3F51B5',
        'pink': '#E91E63'
    }
