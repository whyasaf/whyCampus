// src/components/MobileNav.jsx
import React from 'react';
import { Home, Clock, BookOpen, FileText, Menu, Search, Sun, Moon } from 'lucide-react';

export default function MobileNav({ currentTab, setCurrentTab, onOpenCommandMenu, darkMode, setDarkMode }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <header style={styles.topBar}>
        <div style={styles.brandTitle} onClick={() => setCurrentTab('dashboard')}>
          whyCampus
        </div>
        <div style={styles.topActions}>
          <button onClick={onOpenCommandMenu} style={styles.iconBtn}>
            <Search size={18} />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={styles.iconBtn}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav style={styles.bottomNav}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                ...styles.navBtn,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} style={{ marginBottom: 2, color: isActive ? 'var(--accent)' : 'inherit' }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setCurrentTab('settings')}
          style={{
            ...styles.navBtn,
            color: currentTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <Menu size={18} style={{ marginBottom: 2 }} />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
}

const styles = {
  topBar: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '52px',
    backgroundColor: 'var(--sidebar-bg)',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 40,
    padding: '0 16px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBtn: {
    color: 'var(--text-primary)',
    padding: '4px',
  },
  bottomNav: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '56px',
    backgroundColor: 'var(--sidebar-bg)',
    borderTop: '1px solid var(--border-color)',
    zIndex: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '500',
    padding: '6px 0',
  }
};
