// src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import CoursesList from './components/CoursesList';
import CourseDetail from './components/CourseDetail';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import Materials from './components/Materials';
import Assignments from './components/Assignments';
import Exams from './components/Exams';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import CommandMenu from './components/CommandMenu';
import MobileNav from './components/MobileNav';
import CourseSelectorModal from './components/CourseSelectorModal';

import { 
  INITIAL_USER, 
  COURSES, 
  REAL_WEEKLY_SCHEDULE, 
  INITIAL_NOTES, 
  INITIAL_TASKS,
  INITIAL_MATERIALS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_EXAMS 
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isCourseSelectorOpen, setIsCourseSelectorOpen] = useState(false);

  // App Data State
  const [user, setUser] = useState(INITIAL_USER);
  const [courses, setCourses] = useState(COURSES);
  const [schedule, setSchedule] = useState(REAL_WEEKLY_SCHEDULE);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [exams, setExams] = useState(INITIAL_EXAMS);

  // Selected Detail & Filter Views
  const [selectedCourseId, setSelectedCourseId] = useState('eap101');
  const [selectedCourseIdFilter, setSelectedCourseIdFilter] = useState('All');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Toggle Dark/Light class on html document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Schedule context helper: Check if currently in class or get active viewing course context
  const getScheduleOrCourseContext = () => {
    // If user is currently viewing a specific course detail, preselect that course
    if (currentTab === 'course-detail' && selectedCourseId) {
      return { suggestedCourseId: selectedCourseId, scheduleBanner: null };
    }

    // Check schedule for Wednesday (or live system day)
    const currentClass = schedule.find(s => !s.isFree && s.day === 'Wednesday' && s.time.includes('12:00'));
    if (currentClass) {
      return { suggestedCourseId: currentClass.courseId, scheduleBanner: currentClass };
    }

    return { suggestedCourseId: selectedCourseId || 'eap101', scheduleBanner: null };
  };

  const contextInfo = getScheduleOrCourseContext();

  // Create New Note Flow: Step 1 opens Course Selector modal
  const handleOpenNewNoteModal = () => {
    setIsCourseSelectorOpen(true);
  };

  // Step 2: User selects course in Modal -> create note assigned to that course
  const handleCreateNoteForCourse = (courseId) => {
    const courseObj = courses.find(c => c.id === courseId) || courses[0];
    const nowIso = new Date().toISOString();
    
    const d = new Date(nowIso);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');

    const newNote = {
      id: `n_${Date.now()}`,
      title: 'Untitled Note',
      courseId: courseObj.id,
      courseName: courseObj.name,
      date: `Today · ${hours}:${mins}`,
      timestamp: nowIso,
      updatedAt: nowIso,
      tags: ['Lecture'],
      content: `# ${courseObj.name}\n\nInstructor: ${courseObj.instructor}\nDate: ${d.toLocaleDateString()}\n\n## Lecture Notes\n\nStart typing here...`
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setSelectedCourseIdFilter(courseObj.id); // Filter notes by selected course
    setCurrentTab('notes');
  };

  // Save Note & update timestamp for DESC sorting
  const handleSaveNote = (updatedNote) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (selectedNoteId === noteId) {
      const remaining = notes.filter(n => n.id !== noteId);
      if (remaining.length > 0) setSelectedNoteId(remaining[0].id);
      else setSelectedNoteId(null);
    }
  };

  // Task Management Handlers
  const handleAddTask = (newTask) => {
    // If user is currently on a specific course page, assign courseId automatically (context-aware quick add)
    if (currentTab === 'course-detail' && selectedCourseId && !newTask.courseId) {
      newTask.courseId = selectedCourseId;
    }
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Toggle checklist inside assignment
  const handleToggleChecklist = (assignmentId, checkId) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        const updatedChecklist = a.checklist.map(item => 
          item.id === checkId ? { ...item, done: !item.done } : item
        );
        return { ...a, checklist: updatedChecklist };
      }
      return a;
    }));
  };

  // Command Menu Navigation Dispatcher
  const handleCommandNavigate = (destination, params = {}) => {
    if (destination === 'new-note') {
      handleOpenNewNoteModal();
      return;
    }
    if (destination === 'new-task') {
      setCurrentTab('tasks');
      return;
    }
    if (destination === 'new-event') {
      setCurrentTab('calendar');
      return;
    }
    if (params.courseId) {
      setSelectedCourseId(params.courseId);
    }
    if (params.noteId) {
      setSelectedNoteId(params.noteId);
    }
    setCurrentTab(destination);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <div style={styles.appWrapper}>
      {/* Sidebar Navigation */}
      <div className="desktop-sidebar">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onNewNote={handleOpenNewNoteModal}
        />
      </div>

      {/* Mobile Top/Bottom Nav */}
      <MobileNav 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Workspace Area */}
      <main style={styles.mainWorkspace}>
        {currentTab === 'dashboard' && (
          <Dashboard
            user={user}
            courses={courses}
            schedule={schedule}
            assignments={assignments}
            exams={exams}
            notes={notes}
            tasks={tasks}
            setCurrentTab={setCurrentTab}
            setSelectedCourseId={setSelectedCourseId}
            setSelectedNoteId={setSelectedNoteId}
          />
        )}

        {currentTab === 'schedule' && (
          <Schedule
            schedule={schedule}
            courses={courses}
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setCurrentTab('course-detail');
            }}
          />
        )}

        {currentTab === 'courses' && (
          <CoursesList
            courses={courses}
            notes={notes}
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setCurrentTab('course-detail');
            }}
          />
        )}

        {currentTab === 'course-detail' && (
          <CourseDetail
            course={selectedCourse}
            onBack={() => setCurrentTab('courses')}
            notes={notes}
            materials={materials}
            assignments={assignments}
            tasks={tasks}
            onSelectNote={(noteId) => {
              setSelectedNoteId(noteId);
              setSelectedCourseIdFilter(selectedCourse.id);
              setCurrentTab('notes');
            }}
          />
        )}

        {currentTab === 'notes' && (
          <Notes
            notes={notes}
            courses={courses}
            selectedCourseIdFilter={selectedCourseIdFilter}
            setSelectedCourseIdFilter={setSelectedCourseIdFilter}
            selectedNoteId={selectedNoteId}
            setSelectedNoteId={setSelectedNoteId}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onOpenNewNoteModal={handleOpenNewNoteModal}
          />
        )}

        {currentTab === 'tasks' && (
          <Tasks
            tasks={tasks}
            courses={courses}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'materials' && (
          <Materials
            materials={materials}
            courses={courses}
          />
        )}

        {currentTab === 'assignments' && (
          <Assignments
            assignments={assignments}
            onToggleChecklist={handleToggleChecklist}
          />
        )}

        {currentTab === 'exams' && (
          <Exams
            exams={exams}
            materials={materials}
            notes={notes}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            schedule={schedule}
            assignments={assignments}
            exams={exams}
            courses={courses}
            tasks={tasks}
            onNavigateCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setCurrentTab('course-detail');
            }}
          />
        )}

        {currentTab === 'settings' && (
          <Settings
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </main>

      {/* Global Command/Search Menu (⌘K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        notes={notes}
        courses={courses}
        materials={materials}
        assignments={assignments}
        onNavigate={handleCommandNavigate}
      />

      {/* Course Selection Modal prior to Note Creation */}
      <CourseSelectorModal
        isOpen={isCourseSelectorOpen}
        onClose={() => setIsCourseSelectorOpen(false)}
        courses={courses}
        onSelectCourse={handleCreateNoteForCourse}
        suggestedCourseId={contextInfo.suggestedCourseId}
        scheduleContext={contextInfo.scheduleBanner}
      />
    </div>
  );
}

const styles = {
  appWrapper: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  mainWorkspace: {
    flex: 1,
    minHeight: '100vh',
    overflowY: 'auto',
    position: 'relative',
  }
};
