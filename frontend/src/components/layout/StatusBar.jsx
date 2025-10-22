import { useState } from 'react';
import { 
  IconGitBranch, 
  IconAlertCircle, 
  IconCheck, 
  IconX, 
  IconBell,
  IconSettings,
  IconWifi,
  IconWifiOff,
  IconTerminal,
  IconBug,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

const StatusBar = () => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [notifications, setNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const statusItems = [
    {
      id: 'git',
      icon: IconGitBranch,
      label: 'main',
      tooltip: 'Git branch: main',
      onClick: () => console.log('Git status clicked')
    },
    {
      id: 'errors',
      icon: IconX,
      label: '0',
      tooltip: 'Problems (0)',
      onClick: () => console.log('Problems clicked')
    },
    {
      id: 'warnings',
      icon: IconAlertCircle,
      label: '0',
      tooltip: 'Warnings (0)',
      onClick: () => console.log('Warnings clicked')
    }
  ];

  const rightItems = [
    {
      id: 'encoding',
      label: 'UTF-8',
      tooltip: 'Select Encoding',
      onClick: () => console.log('Encoding clicked')
    },
    {
      id: 'eol',
      label: 'LF',
      tooltip: 'End of Line Sequence',
      onClick: () => console.log('EOL clicked')
    },
    {
      id: 'language',
      label: 'JavaScript',
      tooltip: 'Select Language Mode',
      onClick: () => console.log('Language clicked')
    },
    {
      id: 'spaces',
      label: 'Spaces: 2',
      tooltip: 'Select Indentation',
      onClick: () => console.log('Indentation clicked')
    },
    {
      id: 'connection',
      icon: connectionStatus === 'connected' ? IconWifi : IconWifiOff,
      label: connectionStatus === 'connected' ? 'Connected' : 'Disconnected',
      tooltip: connectionStatus === 'connected' ? 'Connected to server' : 'Disconnected from server',
      onClick: () => console.log('Connection clicked')
    }
  ];

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        {statusItems.map((item) => (
          <button
            key={item.id}
            className="status-item"
            onClick={item.onClick}
            title={item.tooltip}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="status-bar-center">
        <div className="status-indicators">
          <div className="status-indicator">
            <IconCheck size={14} className="status-success" />
            <span>Ready</span>
          </div>
        </div>
      </div>

      <div className="status-bar-right">
        {rightItems.map((item) => (
          <button
            key={item.id}
            className="status-item"
            onClick={item.onClick}
            title={item.tooltip}
          >
            {item.icon && <item.icon size={16} />}
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="status-divider" />
        
        <button 
          className="status-item"
          onClick={() => setShowNotifications(!showNotifications)}
          title="Notifications"
        >
          <IconBell size={16} />
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </button>
        
        <button 
          className="status-item"
          title="Settings"
        >
          <IconSettings size={16} />
        </button>
      </div>
    </div>
  );
};

export default StatusBar;

