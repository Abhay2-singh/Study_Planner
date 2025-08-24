from flask import Blueprint, render_template, redirect, url_for, flash, request, current_app
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from study_planner_flask.models import db, User
from study_planner_flask.forms import RegisterForm, LoginForm

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if user already exists
        with current_app.app_context():
            existing_user = User.query.filter_by(email=form.email.data).first()
            if existing_user:
                flash("Email already registered. Please login instead.", "error")
                return redirect(url_for("auth.login"))
            
            # Create new user
            hashed_pw = generate_password_hash(form.password.data)
            user = User(
                name=form.name.data, 
                email=form.email.data, 
                password_hash=hashed_pw,
                theme="light",
                notifications_enabled=True
            )
            db.session.add(user)
            db.session.commit()
        
        flash("Account created successfully! Please login.", "success")
        return redirect(url_for("auth.login"))
    
    return render_template("register.html", form=form)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    
    form = LoginForm()
    if form.validate_on_submit():
        with current_app.app_context():
            user = User.query.filter_by(email=form.email.data).first()
            if user and check_password_hash(user.password_hash, form.password.data):
                login_user(user, remember=form.remember.data)
                next_page = request.args.get('next')
                if not next_page or not next_page.startswith('/'):
                    next_page = url_for("dashboard")
                return redirect(next_page)
            else:
                flash("Invalid email or password. Please try again.", "error")
    
    return render_template("login.html", form=form)

@auth_bp.route("/logout")
def logout():
    logout_user()
    flash("You have been logged out successfully.", "info")
    return redirect(url_for("index"))
