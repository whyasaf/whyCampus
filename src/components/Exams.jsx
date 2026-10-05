// src/components/Exams.jsx
import React, { useState } from 'react';
import { GraduationCap, Clock, MapPin, CheckCircle, BookOpen, FileText } from 'lucide-react';

export default function Exams({ exams, materials, notes }) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id);

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const examNotes = notes.filter(n => n.courseId === selectedExam?.courseId);
  const examMaterials = materials.filter(m => m.courseId === selectedExam?.courseId);

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tag}>ASSESSMENTS</span>
        <h1 style={styles.title}>Exams & Practicums</h1>
        <p style={styles.subtitle}>Midterms, final examinations, topic breakdown & study progress</p>
      </header>

      <div style={styles.divider} />

      {/* Grid of Exams Overview */}
      <div style={styles.examsGrid}>
        {exams.map(exam => {
          const isSelected = selectedExam && selectedExam.id === exam.id;
          return (
            <div 
              key={exam.id} 
              onClick={() => setSelectedExamId(exam.id)}
              style={{
                ...styles.examCard,
                borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-secondary)',
              }}
            >
              <div style={styles.examCardTop}>
                <span style={styles.examCourseTag}>{exam.courseName}</span>
                <span style={styles.daysBadge}>{exam.daysRemaining} days remaining</span>
              </div>

              <h2 style={styles.examTitle}>{exam.title}</h2>

              <div style={styles.examMetaRow}>
                <span><Clock size={12} style={{ marginRight: 4 }} /> {exam.date} · {exam.time}</span>
                <span style={styles.dot}>•</span>
                <span><MapPin size={12} style={{ marginRight: 4 }} /> {exam.room}</span>
              </div>

              <div style={styles.progressContainer}>
                <div style={styles.progressHeader}>
                  <span style={styles.progLabel}>Study Progress</span>
                  <span style={styles.progPercent}>{exam.studyProgress}%</span>
                </div>
                <div style={styles.track}>
                  <div style={{ ...styles.fill, width: `${exam.studyProgress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.divider} />

      {/* Detailed Exam Prep Workspace */}
      {selectedExam && (
        <div style={styles.prepWorkspace}>
          <div style={styles.workspaceHeader}>
            <span style={styles.sectionTag}>EXAM PREPARATION WORKSPACE</span>
            <h2 style={styles.prepTitle}>{selectedExam.title}</h2>
            <p style={styles.prepWeight}>{selectedExam.weight} · Venue: {selectedExam.room}</p>
          </div>

          <div style={styles.prepGrid}>
            {/* Topics Section */}
            <div style={styles.prepBox}>
              <span style={styles.boxTag}>KEY SYLLABUS TOPICS</span>
              <div style={styles.topicList}>
                {selectedExam.topics.map((topic, idx) => (
                  <div key={idx} style={styles.topicItem}>
                    <CheckCircle size={14} style={{ opacity: 0.5, marginRight: 8 }} />
                    <span style={styles.topicName}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision Notes Section */}
            <div style={styles.prepBox}>
              <span style={styles.boxTag}>RELATED REVISION NOTES ({examNotes.length})</span>
              <div style={styles.refList}>
                {examNotes.map(n => (
                  <div key={n.id} style={styles.refItem}>
                    <FileText size={13} style={{ opacity: 0.6, marginRight: 8 }} />
                    <span style={styles.refName}>{n.title}</span>
                  </div>
                ))}
                {examNotes.length === 0 && <div style={styles.emptyText}>No linked notes</div>}
              </div>
            </div>
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
    margin: '28px 0',
  },
  examsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  examCard: {
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.15s ease',
  },
  examCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examCourseTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  daysBadge: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    fontWeight: '600',
  },
  examTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  examMetaRow: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    opacity: 0.4,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
  },
  progLabel: {
    color: 'var(--text-secondary)',
  },
  progPercent: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  track: {
    height: '4px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: 'var(--accent)',
  },
  prepWorkspace: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  workspaceHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  prepTitle: {
    fontSize: '24px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  prepWeight: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  prepGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  prepBox: {
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  boxTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  topicList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  topicItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  topicName: {
    lineHeight: '1.4',
  },
  refList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  refItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: 'var(--text-primary)',
    padding: '6px 8px',
    borderRadius: '3px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
  },
  refName: {
    fontSize: '12px',
  },
  emptyText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  }
};
