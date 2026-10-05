// src/components/CourseDetail.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  FileText, 
  FolderCheck, 
  CheckSquare, 
  BarChart2, 
  Download,
  ChevronRight
} from 'lucide-react';

export default function CourseDetail({ 
  course, 
  onBack, 
  notes = [], 
  materials = [], 
  assignments = [],
  tasks = [],
  onSelectNote
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!course) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={14} style={{ marginRight: 6 }} />
          <span>Back to Courses</span>
        </button>
        <div>Course details not found.</div>
      </div>
    );
  }

  const courseNotes = notes.filter(n => n.courseId === course.id);
  const courseMaterials = materials.filter(m => m.courseId === course.id);
  const courseAssignments = assignments.filter(a => a.courseId === course.id);
  const courseTasks = tasks.filter(t => t.courseId === course.id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: `Notes (${courseNotes.length})` },
    { id: 'progress', label: 'Progress' }
  ];


  return (
    <div className="fade-in" style={styles.container}>
      {/* Top Navigation Back Button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={14} style={{ marginRight: 6 }} />
        <span>Back to Courses</span>
      </button>

      {/* Hero Header */}
      <header style={styles.header}>
        <div style={styles.headerMeta}>
          <span style={styles.codeTag}>{course.code}</span>
          <span style={styles.creditsTag}>{course.credits} Credits</span>
          <span style={styles.termTag}>Foundation Year · Semester 1</span>
        </div>
        <h1 style={styles.title}>{course.name}</h1>
        <p style={styles.instructorMeta}>
          <User size={14} style={{ marginRight: 6, opacity: 0.7 }} />
          <span>{course.instructor}</span>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>|</span>
          <MapPin size={14} style={{ marginRight: 6, opacity: 0.7 }} />
          <span>{course.room}</span>
        </p>
      </header>

      {/* Tabs Bar */}
      <div style={styles.tabsBar}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              ...styles.tabBtn,
              color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: activeTab === t.id ? '500' : '400',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.divider} />

      {/* TAB CONTENT */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={styles.overviewGrid}>
          {/* Main Column */}
          <div style={styles.mainCol}>
            <section style={styles.section}>
              <span style={styles.sectionTag}>COURSE OVERVIEW</span>
              <p style={styles.description}>{course.overview}</p>
            </section>

            <div style={styles.smallDivider} />

            <section style={styles.section}>
              <span style={styles.sectionTag}>WEEKLY SYLLABUS & TOPICS</span>
              <div style={styles.topicList}>
                {course.topics.map((t, idx) => (
                  <div key={idx} style={styles.topicRow}>
                    <span style={styles.weekBadge}>W0{t.week}</span>
                    <span style={styles.topicTitle}>{t.title}</span>
                    <span style={{
                      ...styles.topicStatus,
                      color: t.status === 'completed' ? 'var(--text-secondary)' : t.status === 'in-progress' ? 'var(--accent)' : 'var(--text-muted)'
                    }}>
                      {t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'Current Unit' : 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side Column */}
          <div style={styles.sideCol}>
            {/* Class Schedule Box */}
            <div style={styles.sideBox}>
              <span style={styles.sideBoxTag}>WEEKLY CLASS TIMES</span>
              <div style={styles.schedList}>
                {course.schedule.map((s, idx) => (
                  <div key={idx} style={styles.schedItem}>
                    <div style={styles.schedDay}>{s.day} ({s.type})</div>
                    <div style={styles.schedTime}>{s.time}</div>
                    <div style={styles.schedRoom}>{s.room}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Tasks */}
            <div style={styles.sideBox}>
              <span style={styles.sideBoxTag}>COURSE TASKS ({courseTasks.length})</span>
              <div style={styles.schedList}>
                {courseTasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: t.completed ? 0.5 : 1 }}>
                    <span style={{ color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>
                      → {t.title}
                    </span>
                  </div>
                ))}
                {courseTasks.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No tasks assigned</div>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={styles.sideBox}>
              <span style={styles.sideBoxTag}>COURSE ESTIMATE</span>
              <div style={styles.estRow}>
                <span style={styles.estLabel}>Calculated Grade</span>
                <span style={styles.estVal}>{course?.stats?.gradeEstimate || 'N/A'}</span>
              </div>
              <div style={styles.estRow}>
                <span style={styles.estLabel}>Pending Tasks</span>
                <span style={styles.estVal}>{course?.stats?.assignmentsPending ?? 0}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div style={styles.notesTabContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>COURSE LECTURE NOTES</span>
          </div>
          <div style={styles.notesList}>
            {courseNotes.map(n => (
              <div key={n.id} style={styles.noteItem} onClick={() => onSelectNote(n.id)}>
                <div>
                  <h3 style={styles.noteItemTitle}>{n.title}</h3>
                  <p style={styles.noteItemMeta}>{n.date} · {n.tags.join(', ')}</p>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
              </div>
            ))}
            {courseNotes.length === 0 && (
              <div style={styles.emptyState}>No notes created for this course yet.</div>
            )}
          </div>
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div style={styles.materialsTabContainer}>
          <span style={styles.sectionTag}>DOCUMENTS & LECTURE SLIDES</span>
          <div style={styles.materialsList}>
            {courseMaterials.map(m => (
              <div key={m.id} style={styles.materialRow}>
                <div style={{ flex: 1 }}>
                  <div style={styles.matTitle}>{m.title}</div>
                  <div style={styles.matMeta}>{m.week} · {m.type} · {m.size} · Uploaded {m.uploadDate}</div>
                </div>
                <button style={styles.downloadBtn}>
                  <Download size={14} style={{ marginRight: 4 }} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <div style={styles.assignmentsTabContainer}>
          <span style={styles.sectionTag}>ASSIGNMENTS & DELIVERABLES</span>
          <div style={styles.assignmentsList}>
            {courseAssignments.map(a => (
              <div key={a.id} style={styles.assignmentBox}>
                <div style={styles.assignHeader}>
                  <h3 style={styles.assignTitle}>{a.title}</h3>
                  <span style={styles.assignStatus}>{a.status}</span>
                </div>
                <p style={styles.assignDue}>{a.formattedDue} · {a.weight}</p>
                <p style={styles.assignDesc}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROGRESS TAB */}
      {activeTab === 'progress' && (
        <div style={styles.progressTabContainer}>
          <span style={styles.sectionTag}>ACADEMIC PROGRESS METRICS</span>
          <div style={styles.progressBox}>
            <div style={styles.progHeader}>
              <span>Semester Completion</span>
              <span>45%</span>
            </div>
            <div style={styles.progTrack}>
              <div style={{ ...styles.progFill, width: '45%' }} />
            </div>
            <p style={styles.progText}>
              You have completed 4 out of 12 weeks of lectures and lab assignments for {course.code}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '36px 32px 80px 32px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  header: {
    marginBottom: '24px',
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  codeTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  creditsTag: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  termTag: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  title: {
    fontSize: '38px',
    fontWeight: '500',
    letterSpacing: '-0.03em',
    marginBottom: '8px',
  },
  instructorMeta: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  tabsBar: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '24px',
  },
  tabBtn: {
    padding: '10px 0',
    fontSize: '13px',
    transition: 'all 0.15s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '28px',
  },
  smallDivider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '24px 0',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: '36px',
  },
  mainCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  },
  topicList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  topicRow: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  weekBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    width: '40px',
  },
  topicTitle: {
    flex: 1,
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  topicStatus: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
  },
  sideCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sideBox: {
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sideBoxTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  schedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  schedItem: {
    fontSize: '12px',
    borderBottom: '1px border-subtle',
    paddingBottom: '6px',
  },
  schedDay: {
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  schedTime: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    fontSize: '11px',
  },
  schedRoom: {
    color: 'var(--text-muted)',
    fontSize: '11px',
  },
  estRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  estLabel: {
    color: 'var(--text-secondary)',
  },
  estVal: {
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  notesTabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  noteItem: {
    padding: '14px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  noteItemTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  noteItemMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  emptyState: {
    padding: '24px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  materialsTabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  materialsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  materialRow: {
    padding: '14px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  matMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  downloadBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    fontSize: '11px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
  },
  assignmentsTabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  assignmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  assignmentBox: {
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
  },
  assignHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  assignStatus: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
  },
  assignDue: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  assignDesc: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    marginTop: '8px',
    lineHeight: '1.5',
  },
  progressTabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  progressBox: {
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  progHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '500',
  },
  progTrack: {
    height: '6px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    backgroundColor: 'var(--accent)',
  },
  progText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  }
};
