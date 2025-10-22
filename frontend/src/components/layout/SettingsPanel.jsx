import { useState } from 'react';
import { 
  IconX, 
  IconSearch, 
  IconSettings, 
  IconPalette, 
  IconKeyboard, 
  IconTerminal,
  IconCode,
  IconEye,
  IconEyeOff,
  IconSun,
  IconMoon,
  IconCheck,
  IconChevronRight
} from '@tabler/icons-react';

const SettingsPanel = ({ onClose, theme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState({
    theme: theme,
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    autoSave: true,
    formatOnSave: true,
    autoComplete: true,
    bracketMatching: true,
    lineNumbers: true,
    cursorBlinking: true,
    smoothScrolling: true,
    fontFamily: 'Consolas, "Courier New", monospace'
  });

  const tabs = [
    { id: 'general', icon: IconSettings, label: 'General' },
    { id: 'appearance', icon: IconPalette, label: 'Appearance' },
    { id: 'editor', icon: IconCode, label: 'Editor' },
    { id: 'keyboard', icon: IconKeyboard, label: 'Keyboard' },
    { id: 'terminal', icon: IconTerminal, label: 'Terminal' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = (newTheme) => {
    onThemeChange(newTheme);
    handleSettingChange('theme', newTheme);
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3 className="settings-section-title">General</h3>
      
      <div className="setting-item">
        <div className="setting-label">
          <label>Auto Save</label>
          <span>Automatically save files when changes are made</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Format on Save</label>
          <span>Format code when saving files</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.formatOnSave}
            onChange={(e) => handleSettingChange('formatOnSave', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Auto Complete</label>
          <span>Enable intelligent code completion</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.autoComplete}
            onChange={(e) => handleSettingChange('autoComplete', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3 className="settings-section-title">Appearance</h3>
      
      <div className="setting-item">
        <div className="setting-label">
          <label>Theme</label>
          <span>Choose your preferred color theme</span>
        </div>
        <div className="theme-selector">
          <button
            className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            <IconSun size={18} />
            Light
          </button>
          <button
            className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <IconMoon size={18} />
            Dark
          </button>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Font Size</label>
          <span>Adjust the editor font size</span>
        </div>
        <input
          type="range"
          min="10"
          max="24"
          value={settings.fontSize}
          onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
          className="range-slider"
        />
        <span className="setting-value">{settings.fontSize}px</span>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Font Family</label>
          <span>Choose your preferred font family</span>
        </div>
        <select
          value={settings.fontFamily}
          onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
          className="setting-select"
        >
          <option value='Consolas, "Courier New", monospace'>Consolas</option>
          <option value='"Fira Code", monospace'>Fira Code</option>
          <option value='"JetBrains Mono", monospace'>JetBrains Mono</option>
          <option value='"Source Code Pro", monospace'>Source Code Pro</option>
        </select>
      </div>
    </div>
  );

  const renderEditorSettings = () => (
    <div className="settings-section">
      <h3 className="settings-section-title">Editor</h3>
      
      <div className="setting-item">
        <div className="setting-label">
          <label>Word Wrap</label>
          <span>Wrap lines that exceed the editor width</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.wordWrap}
            onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Minimap</label>
          <span>Show a minimap of the current file</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.minimap}
            onChange={(e) => handleSettingChange('minimap', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Line Numbers</label>
          <span>Show line numbers in the editor</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.lineNumbers}
            onChange={(e) => handleSettingChange('lineNumbers', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Tab Size</label>
          <span>Number of spaces a tab is equal to</span>
        </div>
        <input
          type="number"
          min="2"
          max="8"
          value={settings.tabSize}
          onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
          className="setting-input"
        />
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Cursor Blinking</label>
          <span>Control cursor blinking animation</span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.cursorBlinking}
            onChange={(e) => handleSettingChange('cursorBlinking', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );

  const renderKeyboardSettings = () => (
    <div className="settings-section">
      <h3 className="settings-section-title">Keyboard Shortcuts</h3>
      
      <div className="shortcuts-list">
        <div className="shortcut-item">
          <div className="shortcut-description">
            <span>Toggle Sidebar</span>
          </div>
          <div className="shortcut-keys">
            <kbd>Ctrl</kbd> + <kbd>B</kbd>
          </div>
        </div>
        
        <div className="shortcut-item">
          <div className="shortcut-description">
            <span>Save File</span>
          </div>
          <div className="shortcut-keys">
            <kbd>Ctrl</kbd> + <kbd>S</kbd>
          </div>
        </div>
        
        <div className="shortcut-item">
          <div className="shortcut-description">
            <span>Find in Files</span>
          </div>
          <div className="shortcut-keys">
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd>
          </div>
        </div>
        
        <div className="shortcut-item">
          <div className="shortcut-description">
            <span>Toggle Terminal</span>
          </div>
          <div className="shortcut-keys">
            <kbd>Ctrl</kbd> + <kbd>`</kbd>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTerminalSettings = () => (
    <div className="settings-section">
      <h3 className="settings-section-title">Terminal</h3>
      
      <div className="setting-item">
        <div className="setting-label">
          <label>Default Shell</label>
          <span>Choose the default terminal shell</span>
        </div>
        <select className="setting-select">
          <option value="bash">Bash</option>
          <option value="powershell">PowerShell</option>
          <option value="cmd">Command Prompt</option>
          <option value="zsh">Zsh</option>
        </select>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <label>Font Size</label>
          <span>Terminal font size</span>
        </div>
        <input
          type="range"
          min="10"
          max="20"
          defaultValue="14"
          className="range-slider"
        />
        <span className="setting-value">14px</span>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'editor':
        return renderEditorSettings();
      case 'keyboard':
        return renderKeyboardSettings();
      case 'terminal':
        return renderTerminalSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="settings-title">
          <IconSettings size={20} />
          <span>Settings</span>
        </div>
        <button className="settings-close" onClick={onClose}>
          <IconX size={18} />
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <div className="settings-search">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="settings-search-input"
            />
          </div>
          
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                <IconChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="settings-main">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

