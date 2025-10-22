import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import SettingsPanel from './SettingsPanel';
import useAuthStore from '../../stores/authStore';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('cipherstudio-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('cipherstudio-theme', theme);
  }, [theme]);

  // Don't show layout for auth pages
  if (!isAuthenticated || location.pathname.includes('/login') || location.pathname.includes('/register')) {
    return <>{children}</>;
  }

  return (
    <div className={`ide-layout ${theme}`}>
      <Navbar 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
        theme={theme}
        onThemeChange={setTheme}
      />
      
      <div className="ide-content">
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="ide-main">
          {children}
        </main>
      </div>
      
      <StatusBar />
      
      {settingsOpen && (
        <SettingsPanel 
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}
    </div>
  );
};

export default Layout;

