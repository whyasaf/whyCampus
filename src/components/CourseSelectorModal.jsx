// src/components/CourseSelectorModal.jsx
import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, Clock, MapPin } from 'lucide-react';

export default function CourseSelectorModal({ 
  isOpen, 
  onClose, 
  courses, 
  onSelectCourse, 
  suggestedCourseId,
  scheduleContext
}) {
  if (!isOpen) return null;

  const suggestedCourse = courses.find(c => c.id === suggestedCourseId);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <span style={styles.tag}>NEW NOTE</span>
            <h2 style={styles.title}>Which course is this for?</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={16} />
          </button>
        </div>

        {/* Schedule Context Banner if currently in class */}
        {scheduleContext && (
          <div style={styles.contextBanner}>
            <div style={styles.contextBannerTop}>
              <span style={styles.contextPulse} />
              <span style={styles.contextTag}>CURRENT CLASS SCHEDULED</span>
            </div>
            <div style={styles.contextName}>{scheduleContext.name}</div>
            <div style={styles.contextMeta}>
              {scheduleContext.type} · {scheduleContext.day} · {scheduleContext.time} · Room {scheduleContext.room}
            </div>
          </div>
        )}

        {/* Course Option Cards List */}
        <div style={styles.courseList}>
          {courses.map(course => {
            const isSuggested = suggestedCourseId === course.id;
            return (
              <div 
                key={course.id} 
                style={{
                  ...styles.courseRow,
                  borderLeft: isSuggested ? '2px solid var(--accent)' : '2px solid var(--border-color)',
                  backgroundColor: isSuggested ? 'var(--bg-active)' : 'var(--bg-secondary)',
                }}
                onClick={() => {
                  onSelectCourse(course.id);
                  onClose();
                }}
              >
                <div style={styles.courseInfo}>
                  <div style={styles.courseHeaderRow}>
                    <span style={styles.courseCode}>{course.code}</span>
                    {isSuggested && <span style={styles.suggestedBadge}>SUGGESTED</span>}
                  </div>
                  <h3 style={styles.courseName}>{course.name}</h3>
                  <span style={styles.instructorText}>Instructor: {course.instructor}</span>
                </div>
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              </div>
            );
          })}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(3px)',
    zIndex: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 24px 16px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  title: {
    fontSize: '20px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    marginTop: '2px',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
  },
  contextBanner: {
    margin: '16px 24px 8px 24px',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contextBannerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  contextPulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
  },
  contextTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    fontWeight: '600',
  },
  contextName: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  contextMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  courseList: {
    padding: '16px 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '380px',
    overflowY: 'auto',
  },
  courseRow: {
    padding: '14px 16px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  courseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  courseHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  courseCode: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  suggestedBadge: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '1px 5px',
    borderRadius: '2px',
  },
  courseName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  instructorText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  }
};
