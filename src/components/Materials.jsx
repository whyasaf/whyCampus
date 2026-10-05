// src/components/Materials.jsx
import React, { useState } from 'react';
import { Download, FileText, Folder, Search, Filter } from 'lucide-react';

export default function Materials({ materials, courses }) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = materials.filter(m => {
    const matchesCourse = selectedCourse === 'All' || m.courseId === selectedCourse;
    const matchesQuery = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesQuery;
  });

  // Group materials by course and week
  const groupedByWeek = filteredMaterials.reduce((acc, curr) => {
    const key = `${curr.courseName} · ${curr.week}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tag}>LIBRARY</span>
        <h1 style={styles.title}>Course Materials</h1>
        <p style={styles.subtitle}>Lecture slides, lab sheets, assignments & required readings</p>
      </header>

      {/* Control Bar */}
      <div style={styles.controlBar}>
        <div style={styles.searchContainer}>
          <Search size={14} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search documents by title or file type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterPillGroup}>
          <button
            onClick={() => setSelectedCourse('All')}
            style={{
              ...styles.filterPill,
              backgroundColor: selectedCourse === 'All' ? 'var(--bg-active)' : 'transparent',
              color: selectedCourse === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            All Courses
          </button>
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              style={{
                ...styles.filterPill,
                backgroundColor: selectedCourse === c.id ? 'var(--bg-active)' : 'transparent',
                color: selectedCourse === c.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Document Grouping */}
      <div style={styles.materialGroups}>
        {Object.keys(groupedByWeek).map(groupName => (
          <div key={groupName} style={styles.groupSection}>
            <div style={styles.groupTitleRow}>
              <Folder size={14} style={{ opacity: 0.6, marginRight: 8 }} />
              <span style={styles.groupTitle}>{groupName}</span>
            </div>

            <div style={styles.fileList}>
              {groupedByWeek[groupName].map(file => (
                <div key={file.id} style={styles.fileRow}>
                  <div style={styles.fileIconContainer}>
                    <FileText size={16} style={{ opacity: 0.7 }} />
                  </div>
                  
                  <div style={styles.fileDetails}>
                    <div style={styles.fileName}>{file.title}</div>
                    <div style={styles.fileMeta}>
                      <span>{file.type}</span>
                      <span style={styles.dot}>•</span>
                      <span>{file.size}</span>
                      <span style={styles.dot}>•</span>
                      <span>Uploaded {file.uploadDate}</span>
                    </div>
                  </div>

                  <button style={styles.downloadActionBtn} title="Download Document">
                    <Download size={14} style={{ marginRight: 6 }} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedByWeek).length === 0 && (
          <div style={styles.emptyState}>No course materials match your search filter.</div>
        )}
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
  controlBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '24px',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 34px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '13px',
    outline: 'none',
  },
  filterPillGroup: {
    display: 'flex',
    gap: '6px',
  },
  filterPill: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid var(--border-color)',
    transition: 'all 0.15s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '28px',
  },
  materialGroups: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  groupSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  groupTitleRow: {
    display: 'flex',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fileRow: {
    padding: '14px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'background-color 0.15s ease',
  },
  fileIconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  fileMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
  },
  dot: {
    opacity: 0.4,
  },
  downloadActionBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)',
  }
};
