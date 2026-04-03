# EduLearn - Education App

## Current State
New project with empty backend and no frontend components.

## Requested Changes (Diff)

### Add
- Courses catalog with categories (Programming, Design, Business, Science)
- Individual course pages with lessons list
- Quiz/assessment feature per course
- User progress tracking (lesson completion, course completion %)
- Dashboard showing recent courses, weekly activity, learning streak
- Featured courses section
- Daily challenge/quiz

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Course data model: id, title, category, description, difficulty, duration, lessons
- Lesson data model: id, courseId, title, content, order
- Quiz data model: id, courseId, questions, options, answers
- User progress: track completed lessons, quiz scores, streak
- APIs: getCourses, getCourse, getLessons, getQuiz, markLessonComplete, submitQuiz, getUserProgress, getDailyChallenge

### Frontend
- Dashboard page: welcome, progress stats (streak, weekly activity, recent courses)
- Courses catalog page: grid of course cards with filter by category
- Course detail page: lesson list with progress, enroll/start
- Lesson viewer: content display, mark complete button
- Quiz page: multiple choice questions, score display
- Navigation: header with logo, nav links, user section
- Progress bars on course cards
- Streak counter and weekly activity chart
