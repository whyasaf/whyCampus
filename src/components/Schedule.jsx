// src/components/Schedule.jsx
import React, { useState } from 'react';
import { Clock, MapPin, User, ChevronRight } from 'lucide-react';

export default function Schedule({ schedule, courses, onSelectCourse }) {
  const [selectedDay, setSelectedDay] = useState('All');
  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleByDay = {
    Monday: schedule.filter(i => i.day === 'Monday'),
    Tuesday: schedule.filter(i => i.day === 'Tuesday'),
    Wednesday: schedule.filter(i => i.day === 'Wednesday'),
    Thursday: schedule.filter(i => i.day === 'Thursday'),
    Friday: schedule.filter(i => i.day === 'Friday'),
    Saturday: schedule.filter(i => i.day === 'Saturday'),
    Sunday: schedule.filter(i => i.day === 'Sunday'),
  };

  return (
    <div className="fade-in" style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.tag}>ACADEMIC TIMETABLE</span>
        <h1 style={styles.title}>Weekly Schedule</h1>
        <p style={styles.subtitle}>Software Engineering · IYZ / Foundation Year · De Montfort University Dubai</p>
      </header>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              ...styles.filterBtn,
              color: selectedDay === day ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: selectedDay === day ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: selectedDay === day ? '500' : '400',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Grid View for All Days */}
      {selectedDay === 'All' ? (
        <div style={styles.weekGrid}>
          {Object.keys(scheduleByDay).map(dayName => {
            const isToday = dayName === 'Wednesday';
            return (
              <div key={dayName} style={styles.dayColumn}>
                <div style={{
                  ...styles.dayHeader,
                  borderBottom: isToday ? '2px solid var(--accent)' : '1px solid var(--border-color)'
                }}>
                  <div style={styles.dayTitleRow}>
                    <span style={styles.dayTitle}>{dayName}</span>
                    {isToday && <span style={styles.todayIndicator}>TODAY</span>}
                  </div>
                </div>
                
                <div style={styles.classList}>
                  {scheduleByDay[dayName].map((item, idx) => {
                    if (item.isFree) {
                      return (
                        <div key={idx} style={styles.freeCard}>
                          <div style={styles.freeTime}>{item.time}</div>
                          <div style={styles.freeText}>{item.name}</div>
                          {item.note && <div style={styles.freeSubNote}>{item.note}</div>}
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        style={styles.classCard}
                        onClick={() => {
                          if (item.courseId) onSelectCourse(item.courseId);
                        }}
                      >
                        <div style={styles.timeTag}>{item.time}</div>
                        <div style={styles.courseName}>{item.name}</div>
                        <div style={styles.metaRow}>
                          <span>{item.isOnline ? 'Online' : `Room ${item.room}`}</span>
                          <span style={styles.dot}>•</span>
                          <span>{item.type}</span>
                        </div>
                        {item.instructor && (
                          <div style={styles.instructorTag}>{item.instructor}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Single Day View */
        <div style={styles.singleDayList}>
          {scheduleByDay[selectedDay]?.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.singleDayRow,
                opacity: item.isFree ? 0.7 : 1,
                backgroundColor: !item.isFree ? 'var(--bg-secondary)' : 'transparent',
                borderLeft: !item.isFree ? '2px solid var(--accent)' : '2px solid var(--border-color)',
              }}
              onClick={() => {
                if (!item.isFree && item.courseId) onSelectCourse(item.courseId);
              }}
            >
              <div style={styles.timeSection}>
                <Clock size={13} style={{ opacity: 0.6, marginRight: 6 }} />
                <span>{item.time}</span>
              </div>
              <div style={styles.infoSection}>
                <h3 style={{
                  ...styles.singleCourseName,
                  fontStyle: item.isFree ? 'italic' : 'normal',
                  color: item.isFree ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>
                  {item.name}
                </h3>
                {!item.isFree ? (
                  <div style={styles.singleCourseMeta}>
                    <span>{item.isOnline ? 'Online (G01-04)' : `Room ${item.room}`}</span>
                    <span style={{ margin: '0 8px', opacity: 0.4 }}>|</span>
                    <span>{item.type}</span>
                    <span style={{ margin: '0 8px', opacity: 0.4 }}>|</span>
                    <span>Instructor: {item.instructor}</span>
                  </div>
                ) : (
                  <div style={styles.freeMetaText}>{item.note}</div>
                )}
              </div>
              {!item.isFree && (
                <div style={styles.arrowSection}>
                  <span style={styles.viewCourseText}>Course View</span>
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
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
  filterBar: {
    display: 'flex',
    gap: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0px',
    marginBottom: '24px',
    overflowX: 'auto',
  },
  filterBtn: {
    padding: '8px 0',
    fontSize: '13px',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '24px',
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px',
  },
  dayColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dayHeader: {
    paddingBottom: '6px',
  },
  dayTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  todayIndicator: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--accent)',
  },
  classList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  classCard: {
    padding: '10px 12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  timeTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  courseName: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  metaRow: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  instructorTag: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  dot: {
    opacity: 0.5,
  },
  freeCard: {
    padding: '10px',
    border: '1px dashed var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  freeTime: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  freeText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  freeSubNote: {
    fontSize: '9px',
    color: 'var(--text-muted)',
  },
  singleDayList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  singleDayRow: {
    padding: '16px 20px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  timeSection: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    width: '160px',
  },
  infoSection: {
    flex: 1,
  },
  singleCourseName: {
    fontSize: '15px',
    fontWeight: '500',
  },
  singleCourseMeta: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  freeMetaText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  arrowSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  viewCourseText: {
    opacity: 0.8,
  }
};
