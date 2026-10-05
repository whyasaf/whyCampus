// Helper for local date string (YYYY-MM-DD) avoiding UTC timezone shift
const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTaskDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${day} ${months[mIdx]} ${year}`;
    }
  }
  return dateStr;
};

export default function Tasks({ tasks, courses, onAddTask, onToggleTask, onDeleteTask }) {
  const [filterCourse, setFilterCourse] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getLocalDateStr());
  const [dueTime, setDueTime] = useState('18:00');
  const [priority, setPriority] = useState('medium');
  const [courseId, setCourseId] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterCourse === 'All') return true;
    return t.courseId === filterCourse;
  });

  // Split tasks into TODAY, UPCOMING, and COMPLETED
  const todayStr = getLocalDateStr();

  const todayTasks = filteredTasks.filter(t => !t.completed && (t.dueDate === todayStr || !t.dueDate));
  const upcomingTasks = filteredTasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: `task_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      dueDate,
      dueTime,
      priority,
      courseId: courseId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in" style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <span style={styles.tag}>ACADEMIC RESPONSIBILITIES</span>
          <h1 style={styles.title}>Tasks & To-Dos</h1>
        </div>

        <div style={styles.headerRight}>
          {/* Course Filter Dropdown */}
          <select 
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            style={styles.courseSelect}
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button onClick={() => setIsModalOpen(true)} style={styles.newTaskBtn}>
            <Plus size={14} style={{ marginRight: 4 }} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      <div style={styles.divider} />

      {/* Task Sections */}
      <div style={styles.sectionsContainer}>
        {/* TODAY TASKS */}
        <section style={styles.taskSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>TODAY ({todayTasks.length})</span>
          </div>

          <div style={styles.taskList}>
            {todayTasks.map(task => {
              const courseObj = courses.find(c => c.id === task.courseId);
              return (
                <div key={task.id} style={styles.taskRow}>
                  <button onClick={() => onToggleTask(task.id)} style={styles.checkBtn}>
                    <Square size={16} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  <div style={styles.taskInfo}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskMeta}>
                      {courseObj && <span style={styles.courseName}>{courseObj.name}</span>}
                      {task.dueTime && <span><Clock size={11} style={styles.iconInline} /> {task.dueTime}</span>}
                      {task.priority && <span style={styles.priorityBadge}>{task.priority.toUpperCase()}</span>}
                    </div>
                  </div>

                  <button onClick={() => onDeleteTask(task.id)} style={styles.deleteIconBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}

            {todayTasks.length === 0 && (
              <div style={styles.emptyText}>No open tasks for today</div>
            )}
          </div>
        </section>

        {/* UPCOMING TASKS */}
        <section style={{ ...styles.taskSection, marginTop: '24px' }}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>UPCOMING ({upcomingTasks.length})</span>
          </div>

          <div style={styles.taskList}>
            {upcomingTasks.map(task => {
              const courseObj = courses.find(c => c.id === task.courseId);
              return (
                <div key={task.id} style={styles.taskRow}>
                  <button onClick={() => onToggleTask(task.id)} style={styles.checkBtn}>
                    <Square size={16} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  <div style={styles.taskInfo}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskMeta}>
                      {courseObj && <span style={styles.courseName}>{courseObj.name}</span>}
                      {task.dueDate && <span><Calendar size={11} style={styles.iconInline} /> {formatTaskDate(task.dueDate)}</span>}
                    </div>
                  </div>

                  <button onClick={() => onDeleteTask(task.id)} style={styles.deleteIconBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}

            {upcomingTasks.length === 0 && (
              <div style={styles.emptyText}>No upcoming deadlines</div>
            )}
          </div>
        </section>

        {/* COMPLETED TASKS */}
        {completedTasks.length > 0 && (
          <section style={{ ...styles.taskSection, marginTop: '24px' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTag}>COMPLETED ({completedTasks.length})</span>
            </div>

            <div style={styles.taskList}>
              {completedTasks.map(task => (
                <div key={task.id} style={{ ...styles.taskRow, opacity: 0.5 }}>
                  <button onClick={() => onToggleTask(task.id)} style={styles.checkBtn}>
                    <CheckSquare size={16} style={{ color: 'var(--accent)' }} />
                  </button>

                  <div style={styles.taskInfo}>
                    <div style={{ ...styles.taskTitle, textDecoration: 'line-through' }}>{task.title}</div>
                  </div>

                  <button onClick={() => onDeleteTask(task.id)} style={styles.deleteIconBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div style={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span style={styles.tag}>NEW TASK</span>
                <h2 style={styles.modalTitle}>Add Responsibility</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Read EAP article, Review algebra..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  style={styles.input} 
                />
              </div>

              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    style={styles.input} 
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Due Time</label>
                  <input 
                    type="time" 
                    value={dueTime} 
                    onChange={(e) => setDueTime(e.target.value)} 
                    style={styles.input} 
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    style={styles.select}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Course (Optional)</label>
                  <select 
                    value={courseId} 
                    onChange={(e) => setCourseId(e.target.value)} 
                    style={styles.select}
                  >
                    <option value="">No Course / Personal</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description</label>
                <textarea 
                  placeholder="Additional details..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  style={styles.textarea} 
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '840px',
    margin: '0 auto',
    padding: '40px 32px 80px 32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
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
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  courseSelect: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '12px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  newTaskBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontSize: '12px',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '28px',
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  sectionTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  taskRow: {
    padding: '12px 14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'background-color 0.15s ease',
  },
  checkBtn: {
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  taskMeta: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  courseName: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  iconInline: {
    verticalAlign: 'text-bottom',
    opacity: 0.6,
  },
  priorityBadge: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--accent)',
  },
  deleteIconBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
  },
  emptyText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    padding: '8px 0',
  },
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
    maxWidth: '480px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    padding: '20px 24px 16px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
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
  modalFooter: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  }
};
