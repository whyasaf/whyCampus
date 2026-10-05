// src/components/Notes.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Trash2, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Code, 
  CheckSquare, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  ArrowLeft,
  BookOpen,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function Notes({ 
  notes, 
  courses, 
  selectedCourseIdFilter,
  setSelectedCourseIdFilter,
  selectedNoteId, 
  setSelectedNoteId, 
  onSaveNote, 
  onDeleteNote, 
  onOpenNewNoteModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving...'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('list'); // 'list' or 'editor'

  // Filter notes by course selection and search query
  const filteredNotes = notes.filter(n => {
    const matchesCourse = selectedCourseIdFilter === 'All' || n.courseId === selectedCourseIdFilter;
    const matchesQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesQuery;
  });

  // Sort notes by updated_at DESC
  const sortedNotes = [...filteredNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Enforce Active Note Safety: when course filter changes, update selectedNoteId to latest note in course (or null)
  useEffect(() => {
    const activeObj = notes.find(n => n.id === selectedNoteId);
    if (selectedCourseIdFilter !== 'All') {
      if (!activeObj || activeObj.courseId !== selectedCourseIdFilter) {
        const firstCourseNote = sortedNotes[0];
        setSelectedNoteId(firstCourseNote ? firstCourseNote.id : null);
      }
    } else {
      if (!activeObj && sortedNotes.length > 0) {
        setSelectedNoteId(sortedNotes[0].id);
      }
    }
  }, [selectedCourseIdFilter, notes, selectedNoteId]);

  // Current active note (safely guarded by courseId filter)
  const activeNote = notes.find(n => n.id === selectedNoteId && (selectedCourseIdFilter === 'All' || n.courseId === selectedCourseIdFilter)) || null;

  const activeCourse = courses.find(c => c.id === (activeNote ? activeNote.courseId : selectedCourseIdFilter));


  // Auto-group notes by date headers (TODAY, YESTERDAY, Date)
  const groupNotesByDate = (notesList) => {
    const groups = {};
    const now = new Date();
    const todayStr = now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    notesList.forEach(note => {
      const noteDate = new Date(note.updatedAt || note.timestamp);
      let dateKey = 'EARLIER';

      if (noteDate.toDateString() === todayStr) {
        dateKey = 'TODAY';
      } else if (noteDate.toDateString() === yesterdayStr) {
        dateKey = 'YESTERDAY';
      } else {
        const month = noteDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        dateKey = `${month} ${noteDate.getDate()}`;
      }

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(note);
    });

    return groups;
  };

  const groupedNotes = groupNotesByDate(sortedNotes);

  // Trigger autosave indicators on title/content edits
  const handleTitleChange = (e) => {
    if (!activeNote) return;
    const newTitle = e.target.value;
    const nowIso = new Date().toISOString();
    setSaveStatus('Saving...');
    onSaveNote({ 
      ...activeNote, 
      title: newTitle, 
      updatedAt: nowIso,
      date: formatNoteDisplayDate(nowIso)
    });
    setTimeout(() => setSaveStatus('Saved'), 600);
  };

  const handleContentChange = (e) => {
    if (!activeNote) return;
    const newContent = e.target.value;
    const nowIso = new Date().toISOString();
    setSaveStatus('Saving...');
    onSaveNote({ 
      ...activeNote, 
      content: newContent, 
      updatedAt: nowIso,
      date: formatNoteDisplayDate(nowIso)
    });
    setTimeout(() => setSaveStatus('Saved'), 600);
  };

  function formatNoteDisplayDate(isoString) {
    const d = new Date(isoString);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `Today · ${hours}:${mins}`;
  }

  const insertFormatting = (prefix, suffix = '') => {
    if (!activeNote) return;
    const textarea = document.getElementById('note-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeNote.content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'Text'}${suffix}`;

    const newContent = activeNote.content.substring(0, start) + replacement + activeNote.content.substring(end);
    
    setSaveStatus('Saving...');
    onSaveNote({ 
      ...activeNote, 
      content: newContent, 
      updatedAt: new Date().toISOString() 
    });
    setTimeout(() => setSaveStatus('Saved'), 600);
  };

  const confirmDelete = () => {
    if (activeNote) {
      onDeleteNote(activeNote.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDEBAR: Course Filter & Notes Navigation */}
      <div style={{
        ...styles.listSidebar,
        display: mobileViewMode === 'editor' ? 'none' : 'flex'
      }}>
        {/* Header & Course Dropdown */}
        <div style={styles.sidebarHeader}>
          <div style={styles.topRow}>
            <span style={styles.sidebarTitle}>Notes</span>
            <button 
              onClick={onOpenNewNoteModal} 
              style={styles.newNoteBtn}
            >
              <Plus size={14} style={{ marginRight: 4 }} />
              <span>New Note</span>
            </button>
          </div>

          {/* Course Selector Filter */}
          <div style={styles.filterRow}>
            <select 
              value={selectedCourseIdFilter}
              onChange={(e) => setSelectedCourseIdFilter(e.target.value)}
              style={styles.courseSelect}
            >
              <option value="All">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div style={styles.searchBox}>
            <Search size={13} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search title, content or course..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Notes List Grouped by Date */}
        <div style={styles.noteListScroll}>
          {Object.keys(groupedNotes).map(groupDate => (
            <div key={groupDate} style={styles.dateGroupSection}>
              <div style={styles.dateGroupHeader}>{groupDate}</div>
              {groupedNotes[groupDate].map(n => {
                const isSelected = activeNote && activeNote.id === n.id;
                return (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      setSelectedNoteId(n.id);
                      setMobileViewMode('editor');
                    }}
                    style={{
                      ...styles.noteCard,
                      backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
                      borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                    }}
                  >
                    <div style={styles.noteCardTitle}>{n.title || 'Untitled Note'}</div>
                    <div style={styles.noteCardMeta}>
                      <span>{n.courseName}</span>
                      <span style={styles.dot}>•</span>
                      <span>{n.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {sortedNotes.length === 0 && (
            <div style={styles.emptyList}>
              <FileText size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div>No notes yet</div>
              <div style={styles.emptySubText}>Click "+ New Note" to create one</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Distraction-free Note Editor */}
      <div style={{
        ...styles.editorMain,
        display: mobileViewMode === 'list' ? 'flex' : 'flex'
      }}>
        {activeNote ? (
          <>
            {/* Editor Action Bar */}
            <div style={styles.editorToolbar}>
              <div style={styles.toolbarLeft}>
                {/* Mobile Back to List Button */}
                <button 
                  onClick={() => setMobileViewMode('list')} 
                  style={styles.mobileBackBtn}
                >
                  <ArrowLeft size={16} />
                </button>

                <div style={styles.courseBadge}>
                  <BookOpen size={12} style={{ marginRight: 6, opacity: 0.7 }} />
                  <span>{activeNote.courseName}</span>
                </div>
                <span style={styles.saveStatusTag}>
                  {saveStatus === 'Saving...' ? (
                    <span style={{ color: 'var(--text-secondary)' }}>Saving...</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}><Check size={11} style={{ marginRight: 2 }} /> Saved</span>
                  )}
                </span>
              </div>

              {/* Formatting Toolbar */}
              <div style={styles.toolbarActions}>
                <button onClick={() => insertFormatting('# ')} style={styles.toolBtn} title="Heading 1"><Heading1 size={15} /></button>
                <button onClick={() => insertFormatting('## ')} style={styles.toolBtn} title="Heading 2"><Heading2 size={15} /></button>
                <button onClick={() => insertFormatting('**', '**')} style={styles.toolBtn} title="Bold"><Bold size={15} /></button>
                <button onClick={() => insertFormatting('*', '*')} style={styles.toolBtn} title="Italic"><Italic size={15} /></button>
                <button onClick={() => insertFormatting('- ')} style={styles.toolBtn} title="Bullet List"><List size={15} /></button>
                <button onClick={() => insertFormatting('1. ')} style={styles.toolBtn} title="Numbered List"><ListOrdered size={15} /></button>
                <button onClick={() => insertFormatting('- [ ] ')} style={styles.toolBtn} title="Checklist"><CheckSquare size={15} /></button>
                <button onClick={() => insertFormatting('```\n', '\n```')} style={styles.toolBtn} title="Code Block"><Code size={15} /></button>
                <button onClick={() => insertFormatting('[', '](url)')} style={styles.toolBtn} title="Link"><LinkIcon size={15} /></button>
                
                <div style={styles.toolbarDivider} />

                {/* Delete Button */}
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)} 
                    style={styles.deleteBtn}
                    title="Delete Note"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <div style={styles.deleteConfirmBar}>
                    <span style={styles.confirmText}>Delete?</span>
                    <button onClick={confirmDelete} style={styles.confirmYesBtn}>Yes</button>
                    <button onClick={() => setShowDeleteConfirm(false)} style={styles.confirmNoBtn}>Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Note Editor Area */}
            <div style={styles.editorContentWrapper}>
              <input 
                type="text" 
                value={activeNote.title} 
                onChange={handleTitleChange} 
                placeholder="Untitled Note..." 
                style={styles.titleInput}
              />

              <div style={styles.editorMetaSub}>
                <span>{activeNote.courseName}</span>
                <span style={styles.dot}>•</span>
                <span>Last updated {activeNote.date}</span>
              </div>

              <textarea
                id="note-editor-textarea"
                value={activeNote.content}
                onChange={handleContentChange}
                placeholder="Start typing your lecture note..."
                style={styles.contentTextarea}
              />
            </div>
          </>
        ) : (
          <div style={styles.noNoteSelected}>
            <FileText size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <span>Select or create a note to begin writing</span>
            <button 
              onClick={onOpenNewNoteModal} 
              style={styles.noNoteCreateBtn}
            >
              + Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  listSidebar: {
    width: '300px',
    backgroundColor: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  newNoteBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontSize: '11px',
    fontWeight: '600',
  },
  filterRow: {
    display: 'flex',
  },
  courseSelect: {
    width: '100%',
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    fontSize: '12px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '6px 10px 6px 30px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    fontSize: '12px',
    outline: 'none',
  },
  noteListScroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  dateGroupSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
  },
  dateGroupHeader: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '8px 16px 4px 16px',
    letterSpacing: '0.08em',
  },
  noteCard: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    transition: 'background-color 0.15s ease',
  },
  noteCardTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  noteCardMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    opacity: 0.4,
  },
  emptyList: {
    padding: '40px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  editorMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--bg-primary)',
  },
  editorToolbar: {
    padding: '12px 32px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mobileBackBtn: {
    display: 'none',
    padding: '4px',
    color: 'var(--text-primary)',
  },
  courseBadge: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    padding: '3px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
  },
  saveStatusTag: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    display: 'flex',
    alignItems: 'center',
  },
  toolbarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  toolBtn: {
    padding: '6px',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
    transition: 'color 0.15s ease',
  },
  toolbarDivider: {
    width: '1px',
    height: '16px',
    backgroundColor: 'var(--border-color)',
    margin: '0 6px',
  },
  deleteBtn: {
    padding: '6px',
    borderRadius: '4px',
    color: '#EF4444',
    opacity: 0.8,
  },
  deleteConfirmBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
  },
  confirmText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  confirmYesBtn: {
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
  },
  confirmNoBtn: {
    padding: '2px 8px',
    borderRadius: '3px',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '11px',
  },
  editorContentWrapper: {
    flex: 1,
    padding: '32px 48px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    overflowY: 'auto',
  },
  titleInput: {
    fontSize: '32px',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    backgroundColor: 'transparent',
  },
  editorMetaSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '24px',
  },
  contentTextarea: {
    flex: 1,
    fontSize: '15px',
    lineHeight: '1.7',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    border: 'none',
    outline: 'none',
    resize: 'none',
    backgroundColor: 'transparent',
    minHeight: '400px',
  },
  noNoteSelected: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  noNoteCreateBtn: {
    marginTop: '16px',
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontWeight: '600',
    fontSize: '12px',
  }
};
