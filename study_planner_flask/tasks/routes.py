from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from models import db, Task, Subject, Exam
from forms import TaskForm, ExamForm, SubjectForm
from datetime import datetime, timedelta

tasks_bp = Blueprint('tasks', __name__)

def get_subject_choices():
    """Get subject choices for the current user"""
    subjects = Subject.query.filter_by(user_id=current_user.id).all()
    if not subjects:
        # If no subjects exist, create a default one
        default_subject = Subject(
            user_id=current_user.id,
            name="General",
            color="#4f46e5",
            description="Default subject for general tasks"
        )
        db.session.add(default_subject)
        db.session.commit()
        subjects = [default_subject]
    
    return [(s.id, s.name) for s in subjects]

@tasks_bp.route("/new", methods=["GET", "POST"])
@login_required
def add_task():
    form = TaskForm()
    form.subject_id.choices = get_subject_choices()
    
    if form.validate_on_submit():
        task = Task(
            user_id=current_user.id,
            subject_id=form.subject_id.data,
            title=form.title.data,
            notes=form.notes.data,
            due_date=form.due_date.data,
            due_time=form.due_time.data,
            priority=form.priority.data,
            reminder_at=form.reminder_at.data,
            repeat_rule=form.repeat_rule.data,
            status="pending",
            created_at=datetime.utcnow()
        )
        db.session.add(task)
        db.session.commit()
        
        flash("Task added successfully!", "success")
        return redirect(url_for("dashboard"))
    
    return render_template("add_task.html", form=form)

@tasks_bp.route("/<int:task_id>/edit", methods=["GET", "POST"])
@login_required
def edit_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("dashboard"))
    
    form = TaskForm(obj=task)
    form.subject_id.choices = get_subject_choices()
    
    if form.validate_on_submit():
        task.subject_id = form.subject_id.data
        task.title = form.title.data
        task.notes = form.notes.data
        task.due_date = form.due_date.data
        task.due_time = form.due_time.data
        task.priority = form.priority.data
        task.reminder_at = form.reminder_at.data
        task.repeat_rule = form.repeat_rule.data
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash("Task updated successfully!", "success")
        return redirect(url_for("dashboard"))
    
    return render_template("edit_task.html", form=form, task=task)

@tasks_bp.route("/<int:task_id>/complete", methods=["POST"])
@login_required
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return jsonify({"error": "Access denied"}), 403
    
    task.status = "completed"
    task.completed_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({"success": True, "status": "completed"})

@tasks_bp.route("/<int:task_id>/delete", methods=["POST"])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("dashboard"))
    
    db.session.delete(task)
    db.session.commit()
    flash("Task deleted successfully!", "success")
    return redirect(url_for("dashboard"))

@tasks_bp.route("/exam/new", methods=["GET", "POST"])
@login_required
def add_exam():
    form = ExamForm()
    form.subject_id.choices = get_subject_choices()
    
    if form.validate_on_submit():
        exam = Exam(
            user_id=current_user.id,
            subject_id=form.subject_id.data,
            title=form.title.data,
            date=form.date.data,
            start_time=form.start_time.data,
            location=form.location.data,
            notes=form.notes.data,
            created_at=datetime.utcnow()
        )
        db.session.add(exam)
        db.session.commit()
        
        flash("Exam added successfully!", "success")
        return redirect(url_for("dashboard"))
    
    return render_template("add_exam.html", form=form)

# Subject Management Routes
@tasks_bp.route("/subjects", methods=["GET", "POST"])
@login_required
def manage_subjects():
    form = SubjectForm()
    subjects = Subject.query.filter_by(user_id=current_user.id).all()
    
    if form.validate_on_submit():
        subject = Subject(
            user_id=current_user.id,
            name=form.name.data,
            color=form.color.data,
            description=form.description.data
        )
        db.session.add(subject)
        db.session.commit()
        
        flash("Subject added successfully!", "success")
        return redirect(url_for("tasks.manage_subjects"))
    
    return render_template("subjects.html", form=form, subjects=subjects)

@tasks_bp.route("/subjects/<int:subject_id>/edit", methods=["GET", "POST"])
@login_required
def edit_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    if subject.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("tasks.manage_subjects"))
    
    form = SubjectForm(obj=subject)
    
    if form.validate_on_submit():
        subject.name = form.name.data
        subject.color = form.color.data
        subject.description = form.description.data
        subject.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash("Subject updated successfully!", "success")
        return redirect(url_for("tasks.manage_subjects"))
    
    return render_template("edit_subject.html", form=form, subject=subject)

@tasks_bp.route("/subjects/<int:subject_id>/delete", methods=["POST"])
@login_required
def delete_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    if subject.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("tasks.manage_subjects"))
    
    # Check if subject has tasks or exams
    if subject.tasks or subject.exams:
        flash("Cannot delete subject with existing tasks or exams.", "error")
        return redirect(url_for("tasks.manage_subjects"))
    
    db.session.delete(subject)
    db.session.commit()
    flash("Subject deleted successfully!", "success")
    return redirect(url_for("tasks.manage_subjects"))

@tasks_bp.route("/api/events")
@login_required
def get_events():
    """API endpoint for FullCalendar events"""
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    exams = Exam.query.filter_by(user_id=current_user.id).all()
    
    events = []
    
    # Add tasks as events
    for task in tasks:
        events.append({
            'id': f'task_{task.id}',
            'title': task.title,
            'start': f"{task.due_date}T{task.due_time}" if task.due_time else str(task.due_date),
            'end': f"{task.due_date}T{task.due_time}" if task.due_time else str(task.due_date),
            'color': task.subject.color if task.subject else '#2196F3',
            'type': 'task',
            'priority': task.priority,
            'status': task.status,
            'subject': task.subject.name if task.subject else 'No Subject'
        })
    
    # Add exams as events
    for exam in exams:
        events.append({
            'id': f'exam_{exam.id}',
            'title': f"📝 {exam.title}",
            'start': f"{exam.date}T{exam.start_time}",
            'end': f"{exam.date}T{exam.start_time}",
            'color': '#F44336',
            'type': 'exam',
            'location': exam.location,
            'subject': exam.subject.name if exam.subject else 'No Subject'
        })
    
    return jsonify(events)
