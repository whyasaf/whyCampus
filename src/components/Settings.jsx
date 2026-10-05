// src/components/Settings.jsx
import React, { useState } from 'react';
import { User, Shield, Moon, Sun, Bell, Database, HardDrive } from 'lucide-react';

export default function Settings({ user, darkMode, setDarkMode }) {
  const [themeMode, setThemeMode] = useState('dark');
  const [defaultView, setDefaultView] = useState('Week');
  const [weekStartsOn, setWeekStartsOn] = useState('Monday');

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === 'dark') {
      setDarkMode(true);
    } else if (mode === 'light') {
      setDarkMode(false);
    } else {
      // System mode preference detection
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <span style={styles.tag}>SETTINGS</span>
        <h1 style={styles.title}>System Settings</h1>
        <p style={styles.subtitle}>Preferences, calendar defaults, keyboard shortcuts, and software identity</p>
      </header>

      <div style={styles.divider} />

      <div style={styles.contentGrid}>
        {/* Section 1: Appearance */}
        <section style={styles.section}>
          <span style={styles.sectionTag}>APPEARANCE</span>
          <div style={styles.formBox}>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Theme Mode</label>
              <div style={styles.pillGroup}>
                {['System', 'Light', 'Dark'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleThemeChange(mode.toLowerCase())}
                    style={{
                      ...styles.pillBtn,
                      backgroundColor: themeMode === mode.toLowerCase() ? 'var(--bg-active)' : 'transparent',
                      color: themeMode === mode.toLowerCase() ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderBottom: themeMode === mode.toLowerCase() ? '2px solid var(--accent)' : '2px solid transparent',
                      fontWeight: themeMode === mode.toLowerCase() ? '600' : '400'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Accent Color</label>
              <div style={styles.accentDisplay}>
                <span style={styles.accentSwatch} />
                <span style={styles.accentHex}>#9FFF00 (whyCampus Accent)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Calendar */}
        <section style={styles.section}>
          <span style={styles.sectionTag}>CALENDAR</span>
          <div style={styles.formBox}>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Default View</label>
              <div style={styles.pillGroup}>
                {['Week', 'Month', 'Day'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setDefaultView(v)}
                    style={{
                      ...styles.pillBtn,
                      backgroundColor: defaultView === v ? 'var(--bg-active)' : 'transparent',
                      color: defaultView === v ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderBottom: defaultView === v ? '2px solid var(--accent)' : '2px solid transparent',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Week Starts On</label>
              <div style={styles.readOnlyVal}>Monday</div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Timezone</label>
              <div style={styles.readOnlyVal}>Asia/Dubai</div>
            </div>
          </div>
        </section>

        {/* Section 3: General */}
        <section style={styles.section}>
          <span style={styles.sectionTag}>GENERAL</span>
          <div style={styles.formBox}>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Command Shortcut</label>
              <div style={styles.readOnlyVal}>Cmd + K (macOS) / Ctrl + K (Windows/Linux)</div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.label}>Date Format</label>
              <div style={styles.readOnlyVal}>YYYY-MM-DD (ISO standard)</div>
            </div>
          </div>
        </section>

        {/* Section 4: About */}
        <section style={styles.section}>
          <span style={styles.sectionTag}>ABOUT</span>
          <div style={styles.aboutBox}>
            <h2 style={styles.aboutTitle}>whyCampus</h2>
            <p style={styles.aboutSub}>A private academic operating system.</p>
            <span style={styles.aboutAuthor}>by whyasaf</span>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '760px',
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
    marginBottom: '32px',
  },
  contentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  formBox: {
    padding: '20px 24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '400',
  },
  pillGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--bg-primary)',
    padding: '3px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
  },
  pillBtn: {
    padding: '4px 10px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    borderRadius: '3px',
    transition: 'all 0.15s ease',
  },
  readOnlyVal: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  accentDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  accentSwatch: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#9FFF00',
  },
  accentHex: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  aboutBox: {
    padding: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  aboutTitle: {
    fontSize: '22px',
    fontWeight: '600',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  aboutSub: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  aboutAuthor: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    marginTop: '8px',
  }
};
