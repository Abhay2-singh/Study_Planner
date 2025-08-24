# 🧠 AI Study Planner - Smart Learning Made Simple

A modern, AI-themed study planning application built with Flask that helps students organize tasks, track progress, and achieve academic excellence through intelligent planning and analytics.

## ✨ Features

### 🎨 Modern AI Design
- **Futuristic UI/UX**: Inspired by modern AI applications with gradient backgrounds and glass-morphism effects
- **Responsive Design**: Mobile-first approach with Material You design principles
- **Dark/Light Mode**: Seamless theme switching with AI-themed color palettes
- **Smooth Animations**: CSS animations and transitions for enhanced user experience

### 🧠 AI-Powered Features
- **Smart Task Management**: Intelligent task prioritization and categorization
- **Progress Analytics**: Advanced charts and visualizations for study tracking
- **Predictive Insights**: AI-driven recommendations for optimal study schedules
- **Intelligent Reminders**: Context-aware notifications and alerts

### 📚 Study Management
- **Task Organization**: Create, edit, and manage study tasks with priorities
- **Subject Management**: Organize tasks by subjects with custom colors and descriptions
- **Exam Scheduling**: Schedule and track important exams and deadlines
- **Study Time Tracking**: Log and analyze study sessions for better productivity

### 📊 Analytics & Progress
- **Visual Dashboards**: Real-time progress tracking with beautiful charts
- **Study Analytics**: Detailed insights into study patterns and performance
- **Goal Setting**: Set and track daily study goals
- **Performance Metrics**: Comprehensive statistics and progress indicators

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StudyPlanner
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv study_planner_env
   source study_planner_env/bin/activate  # On Windows: study_planner_env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   cd study_planner_flask
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🎯 AI Theme Transformation

This project has been completely transformed from a basic study planner to a modern AI-themed application with:

### Design System
- **Color Palette**: Purple/blue gradients inspired by AI and technology
- **Typography**: Inter font family for modern, clean readability
- **Components**: Glass-morphism cards with backdrop blur effects
- **Animations**: Smooth transitions and hover effects throughout

### Key Visual Elements
- **Gradient Backgrounds**: Dynamic color transitions for depth
- **AI Icons**: Brain emoji (🧠) and psychology-themed icons
- **Floating Elements**: Animated components with subtle movements
- **Glow Effects**: Soft shadows and lighting for premium feel

### Responsive Features
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Progressive Enhancement**: Core functionality works without JavaScript

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **Flask-Login**: User authentication
- **Flask-WTF**: Form handling and CSRF protection
- **SQLite**: Lightweight database

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Chart.js**: Data visualization
- **FullCalendar**: Calendar integration
- **Alpine.js**: Lightweight reactive framework

### Design Libraries
- **Material Icons**: Google's icon library
- **Inter Font**: Modern typeface
- **Lottie**: Animation support

## 📁 Project Structure

```
study_planner_flask/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── forms.py              # Form definitions
├── requirements.txt      # Python dependencies
├── auth/                 # Authentication module
│   ├── __init__.py
│   └── routes.py
├── tasks/                # Task management module
│   ├── __init__.py
│   └── routes.py
├── static/               # Static assets
│   ├── css/
│   │   ├── style.css     # Base styles
│   │   └── ai-theme.css  # AI theme styles
│   ├── js/
│   │   └── main.js       # Main JavaScript
│   └── lottie/
│       └── onboarding.json
└── templates/            # HTML templates
    ├── base.html         # Base template
    ├── index.html        # Landing page
    ├── dashboard.html    # Dashboard
    ├── login.html        # Login page
    ├── register.html     # Registration page
    └── ...               # Other templates
```

## 🎨 AI Theme Components

### Color System
```css
/* Primary AI Colors */
--ai-primary: #4f46e5;        /* Indigo */
--ai-secondary: #7c3aed;      /* Purple */
--ai-gradient-primary: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
--ai-gradient-secondary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Component Classes
- `.ai-btn`: AI-themed buttons with gradients
- `.ai-card`: Glass-morphism cards with blur effects
- `.ai-form-*`: Styled form elements
- `.ai-text-gradient`: Gradient text effects
- `.ai-glass`: Glass-morphism utility class

### Animation Classes
- `.fade-in-up`: Smooth entrance animations
- `.pulse`: Subtle pulsing effects
- `.float`: Floating animation for elements

## 🔧 Configuration

### Environment Variables
```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///study_planner.db
FLASK_ENV=development
```

### Customization
- **Colors**: Modify CSS custom properties in `ai-theme.css`
- **Animations**: Adjust timing and easing in CSS
- **Layout**: Customize grid and flexbox layouts
- **Themes**: Add new theme variations

## 📱 Features Overview

### Landing Page
- **Hero Section**: Eye-catching gradient background with AI animation
- **Feature Cards**: Highlighting AI-powered capabilities
- **How It Works**: Step-by-step guide with AI terminology
- **Call-to-Action**: Compelling registration prompts

### Dashboard
- **AI Header**: Gradient background with user welcome
- **Statistics Cards**: Real-time task and progress metrics
- **Task Management**: AI-optimized task lists with priorities
- **Progress Charts**: Visual analytics with Chart.js
- **Quick Actions**: AI-powered shortcuts for common tasks

### Authentication
- **Modern Forms**: Clean, accessible login and registration
- **AI Branding**: Consistent brain icon and gradient styling
- **Responsive Design**: Works perfectly on all devices

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set environment variables
2. Use a production WSGI server (Gunicorn)
3. Configure a reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure database for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern AI applications and Material You design
- **Icons**: Google Material Icons
- **Fonts**: Inter font family
- **Charts**: Chart.js library
- **Animations**: CSS animations and Lottie

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ and AI inspiration for better learning experiences**
