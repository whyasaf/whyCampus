// src/components/CommandMenu.jsx
import React, { useState, useEffect } from 'react';
import { Search, FileText, BookOpen, FolderCheck, CheckSquare, Clock, Calendar, Plus, X } from 'lucide-react';

export default function CommandMenu({ 
  isOpen, 
  onClose, 
  notes = [], 
  courses = [], 
  materials = [], 
  assignments = [], 
  tasks = [],
  schedule = [],
  onNavigate 
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  // Search Notes: title, content, course name
  const filteredNotes = notes.filter(n => {
    const courseObj = courses.find(c => c.id === n.courseId);
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (courseObj && courseObj.name.toLowerCase().includes(q))
    );
  });

  // Search Courses: name, instructor, code
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.code.toLowerCase().includes(q) ||
    c.instructor.toLowerCase().includes(q)
  );

  // Search Tasks: title, description, course name
  const filteredTasks = tasks.filter(t => {
    const courseObj = courses.find(c => c.id === t.courseId);
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (courseObj && courseObj.name.toLowerCase().includes(q))
    );
  });

  // Search Schedule / Calendar: title, description, location, course name
  const filteredSchedule = schedule.filter(s => {
    if (s.isFree) return false;
    const courseObj = courses.find(c => c.id === s.courseId);
    return (
      s.name.toLowerCase().includes(q) ||
      (s.room && s.room.toLowerCase().includes(q)) ||
      (s.instructor && s.instructor.toLowerCase().includes(q)) ||
      (courseObj && courseObj.name.toLowerCase().includes(q))
    );
  });

  const quickActions = [
    { label: 'New Note', action: 'new-note', icon: Plus },
    { label: 'New Task', action: 'new-task', icon: CheckSquare },
    { label: 'New Event', action: 'new-event', icon: Calendar },
    { label: 'Go to Home', tab: 'dashboard', icon: Clock },
    { label: 'Go to Schedule', tab: 'schedule', icon: Clock },
    { label: 'Go to Calendar', tab: 'calendar', icon: Calendar },
    { label: 'Go to Courses', tab: 'courses', icon: BookOpen },
    { label: 'Go to Notes', tab: 'notes', icon: FileText },
    { label: 'Go to Tasks', tab: 'tasks', icon: CheckSquare },
  ].filter(a => a.label.toLowerCase().includes(q));

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search Header Input */}
        <div style={styles.inputRow}>
          <Search size={18} style={styles.searchIcon} />
          <input
            autoFocus
            type="text"
            placeholder="Search whyCampus (Courses, Notes, Tasks, Events...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={styles.resultsScroll}>
          {/* Quick Actions & Quick Add */}
          {quickActions.length > 0 && (
            <div style={styles.group}>
              <span style={styles.groupTitle}>QUICK ADD & NAVIGATION</span>
              {quickActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div 
                    key={idx} 
                    style={styles.itemRow}
                    onClick={() => {
                      onNavigate(act.tab || act.action);
                      onClose();
                    }}
                  >
                    <Icon size={14} style={{ opacity: 0.7, marginRight: 10 }} />
                    <span style={styles.itemTitle}>{act.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Courses Results */}
          {filteredCourses.length > 0 && (
            <div style={styles.group}>
              <span style={styles.groupTitle}>COURSES ({filteredCourses.length})</span>
              {filteredCourses.map((c) => (
                <div 
                  key={c.id} 
                  style={styles.itemRow}
                  onClick={() => {
                    onNavigate('course-detail', { courseId: c.id });
                    onClose();
                  }}
                >
                  <BookOpen size={14} style={{ opacity: 0.7, marginRight: 10 }} />
                  <div style={styles.itemInfo}>
                    <span style={styles.itemTitle}>{c.name} ({c.code})</span>
                    <span style={styles.itemSub}>{c.instructor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div style={styles.group}>
              <span style={styles.groupTitle}>NOTES ({filteredNotes.length})</span>
              {filteredNotes.slice(0, 4).map((n) => (
                <div 
                  key={n.id} 
                  style={styles.itemRow}
                  onClick={() => {
                    onNavigate('notes', { noteId: n.id });
                    onClose();
                  }}
                >
                  <FileText size={14} style={{ opacity: 0.7, marginRight: 10 }} />
                  <div style={styles.itemInfo}>
                    <span style={styles.itemTitle}>{n.title}</span>
                    <span style={styles.itemSub}>{n.courseName} · {n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div style={styles.group}>
              <span style={styles.groupTitle}>TASKS ({filteredTasks.length})</span>
              {filteredTasks.slice(0, 4).map((t) => {
                const courseObj = courses.find(c => c.id === t.courseId);
                return (
                  <div 
                    key={t.id} 
                    style={styles.itemRow}
                    onClick={() => {
                      onNavigate('tasks');
                      onClose();
                    }}
                  >
                    <CheckSquare size={14} style={{ opacity: 0.7, marginRight: 10 }} />
                    <div style={styles.itemInfo}>
                      <span style={styles.itemTitle}>{t.title}</span>
                      <span style={styles.itemSub}>
                        {courseObj ? courseObj.name : 'Personal Task'} {t.dueDate ? `· Due ${t.dueDate}` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Schedule / Calendar Results */}
          {filteredSchedule.length > 0 && (
            <div style={styles.group}>
              <span style={styles.groupTitle}>CALENDAR & CLASSES ({filteredSchedule.length})</span>
              {filteredSchedule.slice(0, 4).map((s) => (
                <div 
                  key={s.id} 
                  style={styles.itemRow}
                  onClick={() => {
                    onNavigate('calendar');
                    onClose();
                  }}
                >
                  <Calendar size={14} style={{ opacity: 0.7, marginRight: 10 }} />
                  <div style={styles.itemInfo}>
                    <span style={styles.itemTitle}>{s.name} ({s.day})</span>
                    <span style={styles.itemSub}>{s.time} · Room {s.room}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {query && 
           filteredNotes.length === 0 && 
           filteredCourses.length === 0 && 
           filteredTasks.length === 0 && 
           filteredSchedule.length === 0 && 
           quickActions.length === 0 && (
            <div style={styles.emptyState}>No matching results for "{query}"</div>
          )}
        </div>

        {/* Command Footer Hint */}
        <div style={styles.footerHint}>
          <span>Use <kbd style={styles.kbd}>↑</kbd> <kbd style={styles.kbd}>↓</kbd> to navigate</span>
          <span><kbd style={styles.kbd}>ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(2px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '100px',
  },
  modal: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '480px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  searchIcon: {
    color: 'var(--text-muted)',
    marginRight: '12px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
  },
  resultsScroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
  },
  groupTitle: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '8px 16px 4px 16px',
    letterSpacing: '0.08em',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  itemSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  footerHint: {
    padding: '10px 16px',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  kbd: {
    fontFamily: 'var(--font-mono)',
    padding: '2px 4px',
    border: '1px solid var(--border-color)',
    borderRadius: '3px',
    backgroundColor: 'var(--bg-primary)',
  }
};
