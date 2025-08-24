from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, DateField, TimeField, SelectField, BooleanField, DateTimeField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional
# from wtforms.ext.sqlalchemy.fields import QuerySelectField  # Removed - not needed for current implementation

class RegisterForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class SubjectForm(FlaskForm):
    name = StringField('Subject Name', validators=[DataRequired(), Length(min=2, max=100)])
    color = StringField('Color', validators=[DataRequired()], default='#2196F3')
    description = TextAreaField('Description')
    submit = SubmitField('Add Subject')

class TaskForm(FlaskForm):
    subject_id = SelectField('Subject', coerce=int, validators=[DataRequired()])
    title = StringField('Task Title', validators=[DataRequired(), Length(min=2, max=200)])
    notes = TextAreaField('Notes')
    due_date = DateField('Due Date', validators=[DataRequired()])
    due_time = TimeField('Due Time', validators=[Optional()])
    priority = SelectField('Priority', choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ], default='medium')
    reminder_at = DateTimeField('Reminder Date & Time', validators=[Optional()], format='%Y-%m-%dT%H:%M')
    repeat_rule = SelectField('Repeat', choices=[
        ('none', 'No Repeat'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly')
    ], default='none')
    submit = SubmitField('Add Task')

class ExamForm(FlaskForm):
    subject_id = SelectField('Subject', coerce=int, validators=[DataRequired()])
    title = StringField('Exam Title', validators=[DataRequired(), Length(min=2, max=200)])
    date = DateField('Exam Date', validators=[DataRequired()])
    start_time = TimeField('Start Time', validators=[Optional()])
    end_time = TimeField('End Time', validators=[Optional()])
    location = StringField('Location')
    notes = TextAreaField('Notes')
    submit = SubmitField('Add Exam')

class StudyLogForm(FlaskForm):
    subject_id = SelectField('Subject', coerce=int, validators=[DataRequired()])
    date = DateField('Study Date', validators=[DataRequired()])
    minutes = StringField('Study Time (minutes)', validators=[DataRequired()])
    notes = TextAreaField('Notes')
    submit = SubmitField('Log Study Time')
