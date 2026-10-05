// src/components/Assignments.jsx
import React, { useState } from 'react';
import { CheckSquare, Clock, Calendar, CheckCircle2, ChevronRight, FileText, AlertCircle } from 'lucide-react';

export default function Assignments({ assignments, onToggleChecklist }) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignments[0]?.id);

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tag}>DELIVERABLES</span>
        <h1 style={styles.title}>Assignments & Tasks</h1>
        <p style={styles.subtitle}>Course projects, lab tasks, problem sets, and submission milestones</p>
      </header>

      <div style={styles.divider} />

      <div style={styles.twoColLayout}>
        {/* Left Column: Assignment Selection List */}
        <div style={styles.listCol}>
          {assignments.map(a => {
            const isSelected = selectedAssignment && selectedAssignment.id === a.id;
            return (
              <div 
                key={a.id} 
                onClick={() => setSelectedAssignmentId(a.id)}
                style={{
                  ...styles.assignmentRow,
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-secondary)',
                  borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                <div style={styles.rowTop}>
                  <span style={styles.courseTag}>{a.courseName}</span>
                  <span style={{
                    ...styles.statusBadge,
                    color: a.status === 'Submitted' ? 'var(--text-secondary)' : 'var(--accent)'
                  }}>
                    {a.status}
                  </span>
                </div>
                <h3 style={styles.rowTitle}>{a.title}</h3>
                <div style={styles.rowMeta}>
                  <Clock size={12} style={{ marginRight: 4, opacity: 0.6 }} />
                  <span>{a.formattedDue}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Assignment View */}
        {selectedAssignment ? (
          <div style={styles.detailCol}>
            {/* Header */}
            <div style={styles.detailHeader}>
              <div style={styles.detailHeaderMeta}>
                <span style={styles.detailCourse}>{selectedAssignment.courseName}</span>
                <span style={styles.detailDue}>{selectedAssignment.formattedDue}</span>
              </div>
              <h2 style={styles.detailTitle}>{selectedAssignment.title}</h2>
              <p style={styles.detailWeight}>{selectedAssignment.weight}</p>
            </div>

            <div style={styles.smallDivider} />

            {/* Description */}
            <section style={styles.section}>
              <span style={styles.sectionTag}>DESCRIPTION</span>
              <p style={styles.descriptionText}>{selectedAssignment.description}</p>
            </section>

            {/* Requirements Bullet Points */}
            <section style={{ ...styles.section, marginTop: '20px' }}>
              <span style={styles.sectionTag}>REQUIREMENTS</span>
              <ul style={styles.reqList}>
                {selectedAssignment.requirements.map((req, idx) => (
                  <li key={idx} style={styles.reqItem}>{req}</li>
                ))}
              </ul>
            </section>

            {/* Interactive Progress Checklist */}
            <section style={{ ...styles.section, marginTop: '24px' }}>
              <div style={styles.checklistHeader}>
                <span style={styles.sectionTag}>MILESTONE CHECKLIST</span>
                <span style={styles.progressCounter}>
                  {selectedAssignment.checklist.filter(c => c.done).length} / {selectedAssignment.checklist.length} Completed
                </span>
              </div>

              <div style={styles.checklistGroup}>
                {selectedAssignment.checklist.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => onToggleChecklist(selectedAssignment.id, item.id)}
                    style={styles.checkRow}
                  >
                    <input 
                      type="checkbox" 
                      checked={item.done} 
                      readOnly 
                      style={styles.checkboxInput}
                    />
                    <span style={{
                      ...styles.checkLabel,
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Notes Section */}
            {selectedAssignment.notes && (
              <section style={{ ...styles.section, marginTop: '24px' }}>
                <span style={styles.sectionTag}>INSTRUCTOR NOTES</span>
                <div style={styles.notesBox}>
                  {selectedAssignment.notes}
                </div>
              </section>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1040px',
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
  smallDivider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '20px 0',
  },
  twoColLayout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '32px',
  },
  listCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  assignmentRow: {
    padding: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'all 0.15s ease',
  },
  rowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  statusBadge: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rowTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  rowMeta: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
  },
  detailCol: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
  },
  detailHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailHeaderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
  },
  detailCourse: {
    color: 'var(--text-secondary)',
  },
  detailDue: {
    color: 'var(--accent)',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: '24px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
  },
  detailWeight: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  descriptionText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  },
  reqList: {
    paddingLeft: '18px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  },
  reqItem: {
    marginBottom: '4px',
  },
  checklistHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCounter: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  checklistGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  checkboxInput: {
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  },
  checkLabel: {
    fontSize: '13px',
  },
  notesBox: {
    padding: '12px 14px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px dashed var(--border-color)',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  }
};
