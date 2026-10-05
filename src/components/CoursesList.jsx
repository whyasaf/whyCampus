// src/components/CoursesList.jsx
import React from 'react';
import { BookOpen, ChevronRight, User, MapPin } from 'lucide-react';

export default function CoursesList({ courses, notes = [], onSelectCourse }) {

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tag}>CURRICULUM</span>
        <h1 style={styles.title}>Enrolled Courses</h1>
        <p style={styles.subtitle}>Foundation Year · Semester 1 · Software Engineering</p>
      </header>

      <div style={styles.divider} />

      <div style={styles.courseList}>
        {courses.map(course => (
          <div 
            key={course.id} 
            style={styles.courseRow}
            onClick={() => onSelectCourse(course.id)}
          >
            <div style={styles.leftCol}>
              <div style={styles.codeMeta}>
                <span style={styles.code}>{course.code}</span>
                <span style={styles.credits}>{course.credits} Credits</span>
              </div>
              <h2 style={styles.courseTitle}>{course.name}</h2>
              <div style={styles.instructorInfo}>
                <User size={13} style={{ opacity: 0.6, marginRight: 4 }} />
                <span>{course.instructor}</span>
                <span style={styles.sep}>•</span>
                <MapPin size={13} style={{ opacity: 0.6, marginRight: 4 }} />
                <span>{course.room}</span>
              </div>
            </div>

            <div style={styles.rightCol}>
              <div style={styles.statsSummary}>
                <div style={styles.statItem}>
                  <span style={styles.statNum}>
                    {notes ? notes.filter(n => n.courseId === course.id).length : 0}
                  </span>
                  <span style={styles.statLabel}>Notes</span>
                </div>

                <div style={styles.statItem}>
                  <span style={styles.statNum}>{course.stats.materialsCount}</span>
                  <span style={styles.statLabel}>Docs</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNum}>{course.stats.gradeEstimate}</span>
                  <span style={styles.statLabel}>Grade</span>
                </div>
              </div>
              <ChevronRight size={18} style={{ opacity: 0.4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '40px 32px 80px 32px',
  },
  header: {
    marginBottom: '28px',
  },
  tag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  title: {
    fontSize: '36px',
    fontWeight: '500',
    letterSpacing: '-0.03em',
    marginTop: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '28px',
  },
  courseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseRow: {
    padding: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  codeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  code: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--accent)',
  },
  credits: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  courseTitle: {
    fontSize: '20px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
  },
  instructorInfo: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  sep: {
    margin: '0 8px',
    color: 'var(--border-color)',
  },
  rightCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  statsSummary: {
    display: 'flex',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statNum: {
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  }
};
