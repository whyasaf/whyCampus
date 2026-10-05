// src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon, 
  Filter,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import CalendarModal from './CalendarModal';

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarView({ schedule, assignments, exams, courses, tasks, onNavigateCourse }) {
  // Current view mode: 'week' (default for academic planning), 'month', 'day'
  const [viewMode, setViewMode] = useState('week');
  
  // Real-time current Date object
  const [now, setNow] = useState(new Date());

  // Navigation date state (defaults to October 5, 2026 per user request)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 5));

  // Category filter state
  const [categoryFilter, setCategoryFilter] = useState('All');

  // User-created events state
  const [userEvents, setUserEvents] = useState([
    {
      id: "evt_1",
      title: "Study for Maths & Vector Problem Set",
      type: "study",
      source: "user",
      date: "2026-10-08",
      startTime: "18:00",
      endTime: "20:00",
      location: "DMU Library Study Room 3",
      description: "Review discrete logic notation and calculus limit proofs.",
      courseId: "mss103"
    },
    {
      id: "evt_2",
      title: "Group Peer Review Session",
      type: "meeting",
      source: "user",
      date: "2026-10-09",
      startTime: "14:00",
      endTime: "15:30",
      location: "Student Commons",
      description: "Discuss APA 7th citation guidelines for EAP1 draft.",
      courseId: "eap101"
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalInitialDate, setModalInitialDate] = useState(null);
  const [modalInitialTime, setModalInitialTime] = useState(null);

  // Live real-time update ticker for current time indicator line
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Category Colors Definition (Subtle borders & dots, avoiding heavy card backgrounds)
  const categoryColors = {
    class: { border: 'var(--accent)', text: 'var(--text-primary)', bg: 'rgba(159, 255, 0, 0.08)' },
    assignment: { border: '#3B82F6', text: 'var(--text-primary)', bg: 'rgba(59, 130, 246, 0.08)' },
    exam: { border: '#EF4444', text: 'var(--text-primary)', bg: 'rgba(239, 68, 68, 0.08)' },
    deadline: { border: '#F97316', text: 'var(--text-primary)', bg: 'rgba(249, 115, 22, 0.08)' },
    study: { border: '#A855F7', text: 'var(--text-primary)', bg: 'rgba(168, 85, 247, 0.08)' },
    meeting: { border: '#06B6D4', text: 'var(--text-primary)', bg: 'rgba(6, 182, 212, 0.08)' },
    personal: { border: '#8A8A8A', text: 'var(--text-primary)', bg: 'rgba(138, 138, 138, 0.08)' },
    travel: { border: '#737373', text: 'var(--text-primary)', bg: 'rgba(115, 115, 115, 0.08)' },
    other: { border: '#525252', text: 'var(--text-primary)', bg: 'rgba(82, 82, 82, 0.08)' },
  };

  // Deriving Class Events dynamically from Schedule (Single Source of Truth)
  const getScheduleClassEvents = () => {
    // Generate dates for current week/month range based on schedule
    const events = [];
    const daysMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
    
    // Create class events for the active visible month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    schedule.forEach(item => {
      if (item.isFree) return;
      const targetDay = daysMap[item.day];

      // Loop through all dates in current month matching the schedule day
      for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === targetDay) {
          const dateStr = getLocalDateStr(d);
          const timeParts = item.time.split('–').map(s => s.trim());
          
          events.push({
            id: `sch_${item.id}_${dateStr}`,
            title: item.name,
            type: 'class',
            source: 'schedule',
            date: dateStr,
            startTime: timeParts[0] || '10:00',
            endTime: timeParts[1] || '12:00',
            location: item.room,
            instructor: item.instructor,
            isOnline: item.isOnline,
            courseId: item.courseId,
            sessionId: item.id
          });
        }
      }
    });

    return events;
  };

  // Deriving Task Deadlines dynamically from Tasks (Single Source of Truth)
  const getTaskDeadlineEvents = () => {
    if (!tasks) return [];
    return tasks
      .filter(t => t.dueDate && !t.completed)
      .map(t => {
        const courseObj = courses?.find(c => c.id === t.courseId);
        return {
          id: `task_deadline_${t.id}`,
          title: `Deadline: ${t.title}`,
          type: 'deadline',
          source: 'task',
          date: t.dueDate,
          startTime: t.dueTime || '18:00',
          endTime: t.dueTime ? `${parseInt(t.dueTime.split(':')[0], 10) + 1}:00` : '19:00',
          location: courseObj ? courseObj.name : 'Personal Task',
          description: t.description,
          courseId: t.courseId,
          taskId: t.id
        };
      });
  };

  // Unified Calendar Events Collection (Schedule Classes + Task Deadlines + User Events)
  const classEvents = getScheduleClassEvents();
  const taskDeadlineEvents = getTaskDeadlineEvents();
  const allEvents = [...classEvents, ...taskDeadlineEvents, ...userEvents];

  // Filter events by selected category
  const filteredEvents = allEvents.filter(evt => {
    if (categoryFilter === 'All') return true;
    return evt.type.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Date Navigation Helpers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Week Dates Calculation
  const getWeekDates = (date) => {
    const curr = new Date(date);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(curr.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const currentWeekDates = getWeekDates(currentDate);

  // Format month and year label
  const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Quick Event Creation by clicking empty slot
  const handleSlotClick = (dateStr, timeStr) => {
    setSelectedEvent(null);
    setModalInitialDate(dateStr);
    setModalInitialTime(timeStr);
    setIsModalOpen(true);
  };

  // Event Handlers
  const handleSaveEvent = (newEvent) => {
    if (selectedEvent && selectedEvent.source === 'user') {
      setUserEvents(prev => prev.map(e => e.id === newEvent.id ? newEvent : e));
    } else {
      setUserEvents(prev => [newEvent, ...prev]);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setUserEvents(prev => prev.filter(e => e.id !== eventId));
    setIsModalOpen(false);
  };

  // Check if a date is today
  const isTodayDate = (dateObj) => {
    return dateObj.toDateString() === now.toDateString();
  };

  // Hours array for time grid (08:00 - 20:00)
  const timeHours = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <div className="fade-in" style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.tag}>PERSONAL TIMELINE (ASIA/DUBAI)</span>
          <h1 style={styles.title}>Academic Calendar</h1>
        </div>

        {/* Global Action: Add Event */}
        <button 
          onClick={() => {
            setSelectedEvent(null);
            setModalInitialDate(getLocalDateStr(new Date()));
            setModalInitialTime('18:00');
            setIsModalOpen(true);
          }}
          style={styles.addEventBtn}
        >
          <Plus size={14} style={{ marginRight: 4 }} />
          <span>Add Event</span>
        </button>
      </header>

      {/* Toolbar: Navigation, View Switcher & Category Filter */}
      <div style={styles.toolbar}>
        <div style={styles.navGroup}>
          <button onClick={handleToday} style={styles.todayBtn}>Today</button>
          <div style={styles.chevronGroup}>
            <button onClick={handlePrev} style={styles.iconNavBtn}><ChevronLeft size={16} /></button>
            <button onClick={handleNext} style={styles.iconNavBtn}><ChevronRight size={16} /></button>
          </div>
          <span style={styles.monthLabel}>{monthYearLabel}</span>
        </div>

        {/* Category Filter Pills */}
        <div style={styles.filterBar}>
          {['All', 'Class', 'Assignment', 'Exam', 'Study', 'Meeting', 'Personal'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                ...styles.filterPill,
                backgroundColor: categoryFilter === cat ? 'var(--bg-active)' : 'transparent',
                color: categoryFilter === cat ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: categoryFilter === cat ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Switcher: Week, Month, Day */}
        <div style={styles.viewSwitcher}>
          {['week', 'month', 'day'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                ...styles.viewBtn,
                backgroundColor: viewMode === mode ? 'var(--bg-active)' : 'transparent',
                color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: viewMode === mode ? '600' : '400',
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.divider} />

      {/* VIEW 1: WEEK TIMELINE (DEFAULT ACADEMIC PLANNING VIEW) */}
      {viewMode === 'week' && (
        <div style={styles.weekTimelineWrapper}>
          {/* Week Header */}
          <div style={styles.weekHeaderRow}>
            <div style={styles.timeGutterHeader}>Time</div>
            {currentWeekDates.map((dateObj, idx) => {
              const isToday = isTodayDate(dateObj);
              const dayName = dateObj.toLocaleString('default', { weekday: 'short' }).toUpperCase();
              const dateNum = dateObj.getDate();

              return (
                <div key={idx} style={{
                  ...styles.weekHeaderCol,
                  borderBottom: isToday ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  backgroundColor: isToday ? 'var(--bg-secondary)' : 'transparent'
                }}>
                  <span style={{
                    ...styles.weekDayName,
                    color: isToday ? 'var(--accent)' : 'var(--text-muted)'
                  }}>{dayName}</span>
                  <span style={{
                    ...styles.weekDateNum,
                    color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}>{dateNum}</span>
                </div>
              );
            })}
          </div>

          {/* Week Time Grid */}
          <div style={styles.weekBodyGrid}>
            {timeHours.map(hour => {
              const timeFormatted = `${hour.toString().padStart(2, '0')}:00`;
              
              return (
                <div key={hour} style={styles.hourRow}>
                  <div style={styles.timeGutterLabel}>{timeFormatted}</div>
                  
                  {currentWeekDates.map((dateObj, dayIdx) => {
                    const dateStr = getLocalDateStr(dateObj);
                    const isToday = isTodayDate(dateObj);

                    // Find events matching date and hour
                    const slotEvents = filteredEvents.filter(evt => {
                      if (evt.date !== dateStr) return false;
                      const evtHour = parseInt(evt.startTime.split(':')[0], 10);
                      return evtHour === hour;
                    });

                    return (
                      <div 
                        key={dayIdx} 
                        style={styles.timeGridCell}
                        onClick={() => handleSlotClick(dateStr, timeFormatted)}
                      >
                        {slotEvents.map(evt => {
                          const colStyle = categoryColors[evt.type.toLowerCase()] || categoryColors.other;
                          return (
                            <div
                              key={evt.id}
                              style={{
                                ...styles.eventBlock,
                                borderLeft: `3px solid ${colStyle.border}`,
                                backgroundColor: colStyle.bg,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (evt.source === 'schedule' && evt.courseId && onNavigateCourse) {
                                  onNavigateCourse(evt.courseId);
                                } else {
                                  setSelectedEvent(evt);
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              <div style={styles.eventTimeTag}>{evt.startTime} – {evt.endTime}</div>
                              <div style={{ ...styles.eventTitle, color: colStyle.text }}>{evt.title}</div>
                              {evt.location && <div style={styles.eventLocationText}>{evt.location}</div>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MONTH VIEW */}
      {viewMode === 'month' && (
        <div style={styles.monthContainer}>
          <div style={styles.monthDaysHeader}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
              <div key={d} style={styles.monthHeaderCell}>{d}</div>
            ))}
          </div>

          <div style={styles.monthGrid}>
            {Array.from({ length: 35 }, (_, idx) => {
              const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const firstDayIndex = (startOfMonth.getDay() + 6) % 7; // Monday offset
              const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), idx - firstDayIndex + 1);
              const dateStr = getLocalDateStr(cellDate);
              const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
              const isToday = isTodayDate(cellDate);

              const dayEvents = filteredEvents.filter(e => e.date === dateStr);

              return (
                <div 
                  key={idx}
                  style={{
                    ...styles.monthCell,
                    opacity: isCurrentMonth ? 1 : 0.4,
                    backgroundColor: isToday ? 'var(--bg-secondary)' : 'transparent',
                    borderTop: isToday ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  }}
                  onClick={() => {
                    setCurrentDate(cellDate);
                    setViewMode('day');
                  }}
                >
                  <div style={styles.monthCellTop}>
                    <span style={{
                      ...styles.monthCellDateNum,
                      fontWeight: isToday ? '600' : '400',
                      color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>
                      {cellDate.getDate()}
                    </span>
                    {isToday && <span style={styles.todayPill}>TODAY</span>}
                  </div>

                  <div style={styles.monthCellEvents}>
                    {dayEvents.slice(0, 3).map(evt => {
                      const colStyle = categoryColors[evt.type.toLowerCase()] || categoryColors.other;
                      return (
                        <div 
                          key={evt.id}
                          style={{
                            ...styles.monthEventDotRow,
                            borderLeft: `2px solid ${colStyle.border}`,
                          }}
                        >
                          <span style={styles.monthEventTitle}>{evt.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span style={styles.moreEventsText}>+{dayEvents.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: DAY TIMELINE VIEW */}
      {viewMode === 'day' && (
        <div style={styles.dayViewContainer}>
          <div style={styles.dayViewHeader}>
            <h2 style={styles.dayViewTitle}>
              {currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            {isTodayDate(currentDate) && <span style={styles.todayPill}>TODAY (ASIA/DUBAI)</span>}
          </div>

          <div style={styles.dayTimelineList}>
            {timeHours.map(hour => {
              const timeFormatted = `${hour.toString().padStart(2, '0')}:00`;
              const dateStr = getLocalDateStr(currentDate);

              const hourEvents = filteredEvents.filter(evt => {
                if (evt.date !== dateStr) return false;
                const evtHour = parseInt(evt.startTime.split(':')[0], 10);
                return evtHour === hour;
              });

              return (
                <div key={hour} style={styles.dayRow}>
                  <div style={styles.dayTimeLabel}>{timeFormatted}</div>
                  <div 
                    style={styles.dayEventSlot}
                    onClick={() => handleSlotClick(dateStr, timeFormatted)}
                  >
                    {hourEvents.map(evt => {
                      const colStyle = categoryColors[evt.type.toLowerCase()] || categoryColors.other;
                      return (
                        <div 
                          key={evt.id}
                          style={{
                            ...styles.dayEventCard,
                            borderLeft: `4px solid ${colStyle.border}`,
                            backgroundColor: colStyle.bg,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (evt.source === 'schedule' && evt.courseId && onNavigateCourse) {
                              onNavigateCourse(evt.courseId);
                            } else {
                              setSelectedEvent(evt);
                              setIsModalOpen(true);
                            }
                          }}
                        >
                          <div style={styles.dayEventHeader}>
                            <span style={styles.dayEventTitle}>{evt.title}</span>
                            <span style={styles.dayEventTime}>{evt.startTime} — {evt.endTime}</span>
                          </div>
                          {evt.location && (
                            <div style={styles.dayEventMeta}>
                              <MapPin size={12} style={{ marginRight: 4 }} />
                              <span>{evt.location}</span>
                              {evt.instructor && <span> · Instructor: {evt.instructor}</span>}
                            </div>
                          )}
                          {evt.description && <p style={styles.dayEventDesc}>{evt.description}</p>}
                        </div>
                      );
                    })}

                    {hourEvents.length === 0 && (
                      <div style={styles.emptySlotText}>Click to schedule</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Dialog for Event Creation & Details */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent}
        initialDate={modalInitialDate}
        initialTime={modalInitialTime}
        courses={courses}
      />
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
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
  addEventBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontSize: '12px',
    fontWeight: '600',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  todayBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    fontSize: '12px',
    color: 'var(--text-primary)',
  },
  chevronGroup: {
    display: 'flex',
    gap: '2px',
  },
  iconNavBtn: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  },
  monthLabel: {
    fontSize: '15px',
    fontWeight: '500',
    letterSpacing: '-0.01em',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
  },
  filterPill: {
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    borderRadius: '3px',
    transition: 'all 0.15s ease',
  },
  viewSwitcher: {
    display: 'flex',
    padding: '2px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
  },
  viewBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    borderRadius: '3px',
    transition: 'all 0.15s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '20px',
  },
  weekTimelineWrapper: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-primary)',
  },
  weekHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '70px repeat(7, 1fr)',
    borderBottom: '1px solid var(--border-color)',
  },
  timeGutterHeader: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '10px',
    borderRight: '1px solid var(--border-color)',
  },
  weekHeaderCol: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid var(--border-color)',
  },
  weekDayName: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
  },
  weekDateNum: {
    fontSize: '14px',
    fontWeight: '500',
  },
  weekBodyGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  hourRow: {
    display: 'grid',
    gridTemplateColumns: '70px repeat(7, 1fr)',
    minHeight: '64px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  timeGutterLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '8px',
    borderRight: '1px solid var(--border-color)',
  },
  timeGridCell: {
    padding: '4px',
    borderRight: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.15s ease',
  },
  eventBlock: {
    padding: '6px 8px',
    borderRadius: '3px',
    marginBottom: '4px',
    cursor: 'pointer',
  },
  eventTimeTag: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  eventTitle: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '1.2',
  },
  eventLocationText: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  monthContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  monthDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
  },
  monthHeaderCell: {
    padding: '8px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    textAlign: 'center',
    borderRight: '1px solid var(--border-color)',
  },
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
  },
  monthCell: {
    minHeight: '100px',
    padding: '8px',
    borderRight: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    cursor: 'pointer',
  },
  monthCellTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthCellDateNum: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
  },
  todayPill: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    fontWeight: '600',
  },
  monthCellEvents: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  monthEventDotRow: {
    paddingLeft: '4px',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  monthEventTitle: {
    color: 'var(--text-primary)',
  },
  moreEventsText: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  dayViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  dayViewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dayViewTitle: {
    fontSize: '20px',
    fontWeight: '500',
  },
  dayTimelineList: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  dayRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    minHeight: '70px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  dayTimeLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '12px',
    borderRight: '1px solid var(--border-color)',
  },
  dayEventSlot: {
    padding: '8px 16px',
    cursor: 'pointer',
  },
  dayEventCard: {
    padding: '10px 14px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dayEventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayEventTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  dayEventTime: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  dayEventMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  dayEventDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  emptySlotText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    padding: '8px 0',
  }
};
