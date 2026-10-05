// src/components/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  Clock, 
  Calendar,
  BookOpen, 
  FileText, 
  CheckSquare, 
  Search, 
  Settings, 
  Sun, 
  Moon,
  Plus
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  darkMode, 
  setDarkMode, 
  onOpenCommandMenu,
  onNewNote
}) {
  const mainNav = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Top Header: Brand Wordmark */}
      <div style={styles.header}>
        <div style={styles.brandContainer} onClick={() => setCurrentTab('dashboard')}>
          <span style={styles.brandName}>whyCampus</span>
          <span style={styles.brandBadge}>DMUD</span>
        </div>
      </div>

      {/* Quick Action */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <button 
          onClick={onNewNote}
          style={styles.quickActionBtn}
          title="Create New Note (Quick Action)"
        >
          <Plus size={14} style={{ marginRight: 6 }} />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Nav Section */}
      <nav style={styles.navGroup}>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                ...styles.navItem,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                fontWeight: isActive ? '500' : '400',
              }}
            >
              <div style={styles.navLeft}>
                {isActive && <div style={styles.activeDot} />}
                <Icon size={16} style={{ opacity: isActive ? 1 : 0.7, marginRight: 10 }} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div style={styles.divider} />

      {/* Secondary Tools: Search & Settings */}
      <nav style={styles.navGroup}>
        {/* Global Search Button */}
        <button 
          onClick={onOpenCommandMenu}
          style={styles.navItem}
        >
          <div style={styles.navLeft}>
            <Search size={16} style={{ opacity: 0.7, marginRight: 10 }} />
            <span>Search</span>
          </div>
          <kbd style={styles.kbdShortcut}>⌘K</kbd>
        </button>

        <button 
          onClick={() => setCurrentTab('settings')}
          style={{
            ...styles.navItem,
            color: currentTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: currentTab === 'settings' ? 'var(--bg-hover)' : 'transparent',
          }}
        >
          <div style={styles.navLeft}>
            <Settings size={16} style={{ opacity: 0.7, marginRight: 10 }} />
            <span>Settings</span>
          </div>
        </button>
      </nav>

      <div style={{ flex: 1 }} />

      <div style={styles.divider} />

      {/* Bottom Controls */}
      <div style={styles.bottomNav}>
        {/* Theme Toggle Button */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={styles.navItem}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div style={styles.navLeft}>
            {darkMode ? (
              <Sun size={16} style={{ opacity: 0.8, marginRight: 10 }} />
            ) : (
              <Moon size={16} style={{ opacity: 0.8, marginRight: 10 }} />
            )}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </div>
        </button>
      </div>

      {/* Digital Identity Footer */}
      <div style={styles.userFooter}>
        <div style={styles.userAvatar}>Ö</div>
        <div style={styles.userInfo}>
          <span style={styles.userHandle}>whyasaf</span>
          <span style={styles.userRole}>Software Engineering</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    backgroundColor: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
    userSelect: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  header: {
    padding: '8px 20px 20px 20px',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.04em',
    color: 'var(--text-primary)',
  },
  brandBadge: {
    fontSize: '9px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    padding: '2px 6px',
    borderRadius: '3px',
    backgroundColor: 'var(--bg-active)',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  quickActionBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  navGroup: {
    padding: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'left',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    width: '100%',
    position: 'relative',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  activeDot: {
    position: 'absolute',
    left: '4px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '12px 16px',
    opacity: 0.6,
  },
  kbdShortcut: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    padding: '2px 5px',
    borderRadius: '3px',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-primary)',
  },
  bottomNav: {
    padding: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userFooter: {
    marginTop: '12px',
    padding: '12px 16px 4px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-active)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.2',
  },
  userHandle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  userRole: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
  }
};
