import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IconMenu2, 
  IconX, 
  IconCode, 
  IconSettings, 
  IconUser, 
  IconLogout,
  IconSun,
  IconMoon,
  IconBell,
  IconSearch,
  IconPlus,
  IconFolder,
  IconFile,
  IconTerminal,
  IconGitBranch,
  IconBug,
  IconPuzzle,
  IconUserCircle
} from '@tabler/icons-react';
import useAuthStore from '../../stores/authStore';

const Navbar = ({ onToggleSidebar, onToggleSettings, theme, onThemeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const isProjectPage = location.pathname.includes('/project/');

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button 
          className="navbar-btn"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
        >
          <IconMenu2 size={18} />
        </button>
        
        <div className="navbar-brand">
          <IconCode size={20} className="navbar-logo" />
          <span className="navbar-title">CipherStudio</span>
        </div>
      </div>

      <div className="navbar-center">
        {isProjectPage && (
          <div className="navbar-search">
            <form onSubmit={handleSearch} className="search-form">
              <IconSearch size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Quick Actions */}
        <div className="navbar-actions">
          <button className="navbar-btn" title="New file">
            <IconFile size={18} />
          </button>
          <button className="navbar-btn" title="New folder">
            <IconFolder size={18} />
          </button>
          <button className="navbar-btn" title="Terminal">
            <IconTerminal size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="navbar-divider" />

        {/* Theme Toggle */}
        <button 
          className="navbar-btn"
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </button>

        {/* Notifications */}
        <button className="navbar-btn" title="Notifications">
          <IconBell size={18} />
        </button>

        {/* Extensions */}
        <button className="navbar-btn" title="Extensions">
          <IconPuzzle size={18} />
        </button>

        {/* User Menu */}
        <div className="navbar-user">
          <button 
            className="navbar-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
          >
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-info">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-email">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
              
              <div className="user-menu-divider" />
              
              <div className="user-menu-items">
                <button className="user-menu-item">
                  <IconUserCircle size={16} />
                  Account Settings
                </button>
                <button className="user-menu-item">
                  <IconSettings size={16} />
                  Preferences
                </button>
                <button className="user-menu-item">
                  <IconGitBranch size={16} />
                  Git Integration
                </button>
                <button className="user-menu-item">
                  <IconBug size={16} />
                  Report Issue
                </button>
              </div>
              
              <div className="user-menu-divider" />
              
              <button className="user-menu-item logout" onClick={handleLogout}>
                <IconLogout size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
