from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Import models and database
from models import db, User

# Import blueprints
from auth.routes import auth_bp
from tasks.routes import tasks_bp

# ---------------- App Factory ----------------
def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    
    # Initialize extensions
    db.init_app(app)
    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(tasks_bp, url_prefix='/tasks')
    
    # Initialize database
    with app.app_context():
        db.create_all()
    
    return app

# Create app instance
app = create_app()

# ---------------- Main Routes ----------------
@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    return render_template("index.html")

@app.route("/dashboard")
@login_required
def dashboard():
    from models import Task, Subject
    from datetime import date
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    subjects = Subject.query.filter_by(user_id=current_user.id).all()
    today = date.today()
    return render_template("dashboard.html", tasks=tasks, subjects=subjects, today=today)

@app.route("/calendar")
@login_required
def calendar():
    from models import Task
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return render_template("calendar.html", tasks=tasks)

@app.route("/test-buttons")
@login_required
def test_buttons():
    return render_template("test_buttons.html")

@app.route("/debug-buttons")
@login_required
def debug_buttons():
    return render_template("debug_buttons.html")

@app.route("/progress")
@login_required
def progress():
    from models import Subject, StudyLog
    from datetime import date, timedelta
    subjects = Subject.query.filter_by(user_id=current_user.id).all()
    
    # Get study logs for the last 30 days
    thirty_days_ago = date.today() - timedelta(days=30)
    study_logs = StudyLog.query.filter(
        StudyLog.user_id == current_user.id,
        StudyLog.date >= thirty_days_ago
    ).all()
    
    return render_template("progress.html", subjects=subjects, study_logs=study_logs)

@app.route("/settings")
@login_required
def settings():
    return render_template("settings.html")

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(debug=True)
