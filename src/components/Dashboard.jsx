// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, MapPin, ChevronRight, User, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function Dashboard({ 
  user, 
  courses, 
  schedule, 
  assignments = [], 
  exams = [], 
  notes = [],
  tasks = [],
  setCurrentTab, 
  setSelectedCourseId,
  setSelectedNoteId
}) {
  // Live system date and time state (Asia/Dubai Timezone)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time in Asia/Dubai context
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDayName = dayNames[currentTime.getDay()];
  const currentDateStr = `${monthNames[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  
  const formattedTimeStr = currentTime.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Day selection state for previewing schedule (defaults to live system day)
  const [selectedDayOverride, setSelectedDayOverride] = useState(currentDayName);

  useEffect(() => {
    setSelectedDayOverride(currentDayName);
  }, [currentDayName]);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Current day's schedule items
  const todayScheduleItems = schedule.filter(item => item.day === selectedDayOverride);
  const actualClassesToday = todayScheduleItems.filter(item => !item.isFree);

  // Calculate free time hours for selected day
  const freeItems = todayScheduleItems.filter(item => item.isFree);
  let freeHoursTotal = 0;
  freeItems.forEach(item => {
    if (item.time.includes('–')) {
      const parts = item.time.split('–').map(p => p.trim());
      const startH = parseInt(parts[0].split(':')[0], 10);
      const endH = parseInt(parts[1].split(':')[0], 10);
      if (!isNaN(startH) && !isNaN(endH)) {
        freeHoursTotal += (endH - startH);
      }
    }
  });

  // Current live class & Next class calculation
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentMinutesVal = currentHour * 60 + currentMinute;

  let liveClass = null;
  let nextClass = null;

  actualClassesToday.forEach(c => {
    if (c.startTime && c.endTime) {
      const sParts = c.startTime.split(':').map(Number);
      const eParts = c.endTime.split(':').map(Number);
      const sMin = sParts[0] * 60 + sParts[1];
      const eMin = eParts[0] * 60 + eParts[1];

      if (currentMinutesVal >= sMin && currentMinutesVal < eMin) {
        liveClass = c;
      } else if (currentMinutesVal < sMin && (!nextClass || sMin < nextClass.sMin)) {
        const diffMins = sMin - currentMinutesVal;
        const diffH = Math.floor(diffMins / 60);
        const diffM = diffMins % 60;
        nextClass = { ...c, sMin, countdownStr: diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m` };
      }
    }
  });

  if (!nextClass && actualClassesToday.length > 0) {
    nextClass = actualClassesToday[0];
  }

  // Open tasks calculation
  const openTasks = tasks.filter(t => !t.completed);

  // Recent notes sorted by updatedAt DESC
  const recentNotesSorted = [...notes].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 3);

  // Combined upcoming items (Tasks + Assignments)
  const combinedUpcoming = [
    ...openTasks.filter(t => t.dueDate).map(t => {
      const courseObj = courses.find(c => c.id === t.courseId);
      return {
        id: `t_${t.id}`,
        title: t.title,
        courseName: courseObj ? courseObj.name : 'Personal Task',
        dueDateStr: t.dueDate,
        timeStr: t.dueTime || '18:00',
        tab: 'tasks'
      };
    }),
    ...assignments.map(a => ({
      id: `a_${a.id}`,
      title: a.title,
      courseName: a.courseName,
      dueDateStr: a.dueDate,
      timeStr: '23:59',
      tab: 'assignments'
    }))
  ].sort((a, b) => (a.dueDateStr > b.dueDateStr ? 1 : -1)).slice(0, 4);

  return (
    <div className="fade-in" style={styles.container}>
      {/* Editorial Header Section with Live Clock */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <span style={styles.brandTitle}>whyCampus</span>
          <span style={styles.locationBadge}>{user.university} · {user.level} ({user.academicYear})</span>
          
          {/* Live System Time & Date Widget */}
          <div style={styles.liveClockWidget}>
            <span style={styles.liveClockDot} />
            <span style={styles.liveClockTime}>{formattedTimeStr}</span>
            <span style={styles.liveClockDate}>{currentDayName}, {currentDateStr}</span>
          </div>
        </div>

        <h1 style={styles.greeting}>Good morning, {user.name}.</h1>
        
        {/* Day Switcher */}
        <div style={styles.dateRow}>
          <span style={styles.dateSub}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedDayOverride}</strong> · {currentDateStr}
            {selectedDayOverride === currentDayName && <span style={styles.liveTag}> (Today)</span>}
          </span>

          <div style={styles.dayPickerPills}>
            {daysList.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDayOverride(day)}
                style={{
                  ...styles.dayPill,
                  backgroundColor: selectedDayOverride === day ? 'var(--bg-active)' : 'transparent',
                  color: selectedDayOverride === day ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: selectedDayOverride === day ? '2px solid var(--accent)' : '2px solid transparent',
                  fontWeight: selectedDayOverride === day ? '600' : '400'
                }}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={styles.divider} />

      {/* SCHEDULE INTELLIGENCE HEADER: LIVE CLASS / NEXT CLASS / FREE TIME */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>SCHEDULE INTELLIGENCE</span>
          {freeHoursTotal > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              You have {freeHoursTotal} hour{freeHoursTotal > 1 ? 's' : ''} of free time today.
            </span>
          )}
        </div>

        {/* LIVE CLASS ITEM */}
        {liveClass ? (
          <div 
            style={{ ...styles.nextClassBlock, borderLeft: '4px solid var(--accent)' }}
            onClick={() => {
              if (liveClass.courseId) {
                setSelectedCourseId(liveClass.courseId);
                setCurrentTab('course-detail');
              }
            }}
          >
            <div style={styles.nextClassMain}>
              <div style={styles.nextClassLeft}>
                <div style={styles.liveIndicator}>
                  <span style={styles.livePulse} />
                  <span style={{ color: 'var(--accent)', fontWeight: '700' }}>LIVE NOW</span>
                  <span>· {liveClass.time}</span>
                </div>
                <h2 style={styles.nextClassName}>{liveClass.name}</h2>
                <div style={styles.nextClassMeta}>
                  <span><Clock size={13} style={styles.iconInline} /> {liveClass.time}</span>
                  <span style={styles.dotSep}>•</span>
                  <span><MapPin size={13} style={styles.iconInline} /> Room {liveClass.room}</span>
                  <span style={styles.dotSep}>•</span>
                  <span>{liveClass.type}</span>
                </div>
              </div>
              <div style={styles.actionArrow}>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        ) : nextClass ? (
          <div 
            style={styles.nextClassBlock}
            onClick={() => {
              if (nextClass.courseId) {
                setSelectedCourseId(nextClass.courseId);
                setCurrentTab('course-detail');
              }
            }}
          >
            <div style={styles.nextClassMain}>
              <div style={styles.nextClassLeft}>
                <div style={styles.liveIndicator}>
                  <span style={{ color: 'var(--text-secondary)' }}>NEXT CLASS</span>
                  {nextClass.countdownStr && (
                    <span style={{ color: 'var(--accent)', marginLeft: 6 }}>· Starts in {nextClass.countdownStr}</span>
                  )}
                </div>
                <h2 style={styles.nextClassName}>{nextClass.name}</h2>
                <div style={styles.nextClassMeta}>
                  <span><Clock size={13} style={styles.iconInline} /> {nextClass.time}</span>
                  <span style={styles.dotSep}>•</span>
                  <span><MapPin size={13} style={styles.iconInline} /> Room {nextClass.room}</span>
                  <span style={styles.dotSep}>•</span>
                  <span>{nextClass.type}</span>
                </div>
              </div>
              <div style={styles.actionArrow}>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.freeDayBlock}>
            <span style={styles.freeDayTitle}>No classes scheduled.</span>
            <span style={styles.freeDaySub}>
              Enjoy your study break and focus on personal software projects.
            </span>
          </div>
        )}
      </section>

      <div style={styles.divider} />

      {/* TWO COLUMN EDITORIAL GRID */}
      <div style={styles.gridTwoCol}>
        {/* Left Column: Today's Real Schedule */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>TIMETABLE ({selectedDayOverride.toUpperCase()})</span>
            <button style={styles.linkBtn} onClick={() => setCurrentTab('schedule')}>
              Full timetable <ChevronRight size={12} />
            </button>
          </div>

          <div style={styles.timelineList}>
            {todayScheduleItems.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.timelineRow,
                  borderLeft: !item.isFree ? '2px solid var(--accent)' : '2px solid var(--border-color)',
                  backgroundColor: !item.isFree ? 'var(--bg-secondary)' : 'transparent',
                  opacity: item.isFree ? 0.7 : 1,
                }}
                onClick={() => {
                  if (!item.isFree && item.courseId) {
                    setSelectedCourseId(item.courseId);
                    setCurrentTab('course-detail');
                  }
                }}
              >
                <div style={styles.timeCol}>{item.time}</div>
                <div style={styles.detailsCol}>
                  <div style={{
                    ...styles.classTitle,
                    color: item.isFree ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontStyle: item.isFree ? 'italic' : 'normal'
                  }}>
                    {item.name}
                  </div>
                  {!item.isFree ? (
                    <div style={styles.classSub}>
                      Room {item.room} · {item.type} {item.instructor ? `· ${item.instructor}` : ''}
                    </div>
                  ) : (
                    <div style={styles.freeSub}>
                      {item.note || 'Free time gap'}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {todayScheduleItems.length === 0 && (
              <div style={styles.emptyDayText}>No scheduled items for this day.</div>
            )}
          </div>
        </section>

        {/* Right Column: System Info & Open Tasks */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>UPCOMING DEADLINES ({combinedUpcoming.length})</span>
            <button style={styles.linkBtn} onClick={() => setCurrentTab('tasks')}>
              {openTasks.length} open task{openTasks.length !== 1 ? 's' : ''} <ChevronRight size={12} />
            </button>
          </div>

          <div style={styles.upcomingList}>
            {combinedUpcoming.map((item) => (
              <div 
                key={item.id} 
                style={styles.upcomingRow}
                onClick={() => setCurrentTab(item.tab)}
              >
                <div style={styles.upcomingTop}>
                  <span style={styles.courseTag}>{item.courseName}</span>
                  <span style={styles.dueBadge}>{item.dueDateStr}</span>
                </div>
                <div style={styles.upcomingTitle}>{item.title}</div>
              </div>
            ))}
            {combinedUpcoming.length === 0 && (
              <div style={styles.emptyDayText}>No upcoming deadlines</div>
            )}
          </div>
        </section>
      </div>

      <div style={styles.divider} />

      {/* RECENT NOTES & ACADEMIC OPERATING SYSTEM STATUS */}
      <div style={styles.gridTwoCol}>
        {/* Recent Notes */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>RECENT LECTURE NOTES</span>
            <button style={styles.linkBtn} onClick={() => setCurrentTab('notes')}>
              View library <ChevronRight size={12} />
            </button>
          </div>

          <div style={styles.recentNotesList}>
            {recentNotesSorted.map((note) => (
              <div 
                key={note.id} 
                style={styles.noteRow}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setCurrentTab('notes');
                }}
              >
                <div style={styles.noteLeft}>
                  <div>
                    <div style={styles.noteTitle}>{note.title}</div>
                    <div style={styles.noteMeta}>{note.courseName} · {note.date}</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.4 }} />
              </div>
            ))}
            {recentNotesSorted.length === 0 && (
              <div style={styles.emptyDayText}>No lecture notes created yet.</div>
            )}
          </div>
        </section>

        {/* Academic Identity Details */}
        <section style={styles.section}>
          <span style={styles.sectionTag}>PERSONAL ACADEMIC OPERATING SYSTEM</span>
          <div style={styles.statusBox}>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Student Identity</span>
              <span style={styles.statusVal}>{user.fullName} ({user.handle})</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Institution</span>
              <span style={styles.statusVal}>{user.university}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Current Level</span>
              <span style={styles.statusVal}>{user.level} ({user.academicYear})</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Degree Pathway</span>
              <span style={styles.statusVal}>{user.futureProgram}</span>
            </div>
          </div>
        </section>
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
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  brandTitle: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  locationBadge: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    borderLeft: '1px solid var(--border-color)',
    paddingLeft: '12px',
  },
  liveClockWidget: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
  },
  liveClockDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    boxShadow: '0 0 6px var(--accent)',
  },
  liveClockTime: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  liveClockDate: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    borderLeft: '1px solid var(--border-color)',
    paddingLeft: '8px',
  },
  greeting: {
    fontSize: '44px',
    fontWeight: '500',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    lineHeight: '1.1',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4px',
  },
  dateSub: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: '400',
  },
  liveTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    fontWeight: '600',
  },
  dayPickerPills: {
    display: 'flex',
    gap: '4px',
  },
  dayPill: {
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    borderRadius: '3px',
    transition: 'all 0.15s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '28px 0',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  linkBtn: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.15s ease',
  },
  nextClassBlock: {
    padding: '24px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease',
  },
  nextClassMain: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nextClassLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  liveIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  livePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  nextClassName: {
    fontSize: '24px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
  },
  nextClassMeta: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconInline: {
    verticalAlign: 'text-bottom',
    opacity: 0.7,
  },
  dotSep: {
    color: 'var(--border-color)',
  },
  actionArrow: {
    color: 'var(--text-secondary)',
    opacity: 0.6,
  },
  freeDayBlock: {
    padding: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  freeDayTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  freeDaySub: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  timelineRow: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderRadius: '4px',
    transition: 'background-color 0.15s ease',
  },
  timeCol: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    width: '110px',
    flexShrink: 0,
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  classTitle: {
    fontSize: '14px',
    fontWeight: '500',
  },
  classSub: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  freeSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  emptyDayText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    padding: '12px 0',
  },
  upcomingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  upcomingRow: {
    padding: '14px 16px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  upcomingTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  dueBadge: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  upcomingTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  nextPeekBox: {
    padding: '14px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  peekHeader: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
  },
  peekTitle: {
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  peekMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  recentNotesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  noteRow: {
    padding: '12px 14px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  noteLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  noteMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  statusBox: {
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
  },
  statusLabel: {
    color: 'var(--text-secondary)',
  },
  statusVal: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  }
};
