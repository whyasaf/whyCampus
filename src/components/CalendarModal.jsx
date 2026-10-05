const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  initialEvent, 
  initialDate, 
  initialTime,
  courses 
}) {
  if (!isOpen) return null;

  const isEditing = !!initialEvent && initialEvent.source === 'user';
  const isClassEvent = !!initialEvent && initialEvent.source === 'schedule';

  const [title, setTitle] = useState(initialEvent ? initialEvent.title : '');
  const [date, setDate] = useState(initialEvent ? initialEvent.date : (initialDate || getLocalDateStr()));
  const [startTime, setStartTime] = useState(initialEvent ? initialEvent.startTime : (initialTime || '18:00'));
  const [endTime, setEndTime] = useState(initialEvent ? initialEvent.endTime : '19:00');
  const [category, setCategory] = useState(initialEvent ? initialEvent.type : 'study');
  const [location, setLocation] = useState(initialEvent ? initialEvent.location : '');
  const [description, setDescription] = useState(initialEvent ? initialEvent.description : '');
  const [allDay, setAllDay] = useState(initialEvent ? !!initialEvent.allDay : false);
  const [courseId, setCourseId] = useState(initialEvent ? initialEvent.courseId : '');
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const categories = [
    { id: 'assignment', label: 'Assignment' },
    { id: 'exam', label: 'Exam' },
    { id: 'deadline', label: 'Deadline' },
    { id: 'study', label: 'Study' },
    { id: 'meeting', label: 'Meeting' },
    { id: 'personal', label: 'Personal' },
    { id: 'travel', label: 'Travel' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialEvent ? initialEvent.id : `evt_${Date.now()}`,
      title: title.trim(),
      type: category,
      source: 'user',
      date,
      startTime,
      endTime,
      allDay,
      location,
      description,
      courseId: courseId || null,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div>
            <span style={styles.tag}>{isClassEvent ? 'CLASS SESSION' : (isEditing ? 'EDIT EVENT' : 'NEW EVENT')}</span>
            <h2 style={styles.title}>
              {isClassEvent ? initialEvent.title : (isEditing ? 'Edit Calendar Event' : 'Add Calendar Event')}
            </h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={16} />
          </button>
        </div>

        {/* Read-only layout for Schedule-derived Class Events */}
        {isClassEvent ? (
          <div style={styles.readOnlyBody}>
            <div style={styles.readOnlyRow}>
              <Clock size={14} style={{ opacity: 0.6 }} />
              <span>{initialEvent.date} · {initialEvent.startTime} — {initialEvent.endTime}</span>
            </div>
            <div style={styles.readOnlyRow}>
              <MapPin size={14} style={{ opacity: 0.6 }} />
              <span>{initialEvent.isOnline ? 'Online (Group G01-04)' : `Room ${initialEvent.location}`}</span>
            </div>
            {initialEvent.instructor && (
              <div style={styles.readOnlyRow}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Instructor: <strong>{initialEvent.instructor}</strong>
                </span>
              </div>
            )}
            <p style={styles.classNoteText}>
              Class sessions are automatically synced from your real university schedule.
            </p>
          </div>
        ) : (
          /* Editable Form for User-Created Events */
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Title</label>
              <input 
                type="text" 
                placeholder="e.g. Study for Maths, Essay Draft..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.twoCol}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {!allDay && (
              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>End Time</label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            <div style={styles.twoCol}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Location / Room</label>
                <input 
                  type="text" 
                  placeholder="e.g. DMU Library Room 3" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Related Course (Optional)</label>
                <select 
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">None / General</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description / Notes</label>
              <textarea 
                placeholder="Add agenda, preparation steps, or links..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />
            </div>

            {/* Footer Buttons */}
            <div style={styles.footer}>
              {isEditing ? (
                !showConfirmDelete ? (
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmDelete(true)} 
                    style={styles.deleteBtn}
                  >
                    Delete Event
                  </button>
                ) : (
                  <div style={styles.confirmDeleteBar}>
                    <span style={styles.confirmText}>Delete event?</span>
                    <button 
                      type="button" 
                      onClick={() => onDelete(initialEvent.id)} 
                      style={styles.confirmYesBtn}
                    >
                      Delete
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmDelete(false)} 
                      style={styles.confirmNoBtn}
                    >
                      Cancel
                    </button>
                  </div>
                )
              ) : <div />}

              <div style={styles.rightActions}>
                <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>
                  {isEditing ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </div>
          </form>
        )}
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
    zIndex: 150,
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
  form: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  label: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  input: {
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  select: {
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '12px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  textarea: {
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'none',
    minHeight: '60px',
  },
  footer: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightActions: {
    display: 'flex',
    gap: '8px',
  },
  cancelBtn: {
    padding: '8px 14px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  submitBtn: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontSize: '12px',
    fontWeight: '600',
  },
  deleteBtn: {
    fontSize: '12px',
    color: '#EF4444',
  },
  confirmDeleteBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  confirmText: {
    fontSize: '11px',
    color: '#EF4444',
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
  readOnlyBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  readOnlyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  classNoteText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '8px',
  }
};
