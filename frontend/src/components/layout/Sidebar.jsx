import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IconCode, 
  IconFileCode, 
  IconFolder, 
  IconFolderOpen, 
  IconChevronDown, 
  IconChevronRight,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTerminal,
  IconDatabase,
  IconServer,
  IconCloud
} from '@tabler/icons-react';

const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedFolders, setExpandedFolders] = useState({
    'project': true,
    'components': true,
    'utils': false
  });

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const fileStructure = [
    {
      name: 'project',
      type: 'folder',
      children: [
        { name: 'src', type: 'folder', children: [
          { name: 'components', type: 'folder', children: [
            { name: 'Button.jsx', type: 'file' },
            { name: 'Modal.jsx', type: 'file' },
            { name: 'Input.jsx', type: 'file' }
          ]},
          { name: 'utils', type: 'folder', children: [
            { name: 'helpers.js', type: 'file' },
            { name: 'constants.js', type: 'file' }
          ]},
          { name: 'App.jsx', type: 'file' },
          { name: 'index.js', type: 'file' }
        ]},
        { name: 'public', type: 'folder', children: [
          { name: 'index.html', type: 'file' },
          { name: 'favicon.ico', type: 'file' }
        ]},
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file' }
      ]
    }
  ];

  const renderFileItem = (item, level = 0) => {
    const isExpanded = expandedFolders[item.name];
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.name} className="file-item">
        <div 
          className={`file-row ${level > 0 ? 'nested' : ''}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.name);
            } else {
              // Handle file click - could open file in editor
              console.log('Opening file:', item.name);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              {hasChildren ? (
                isExpanded ? <IconChevronDown className="chevron" /> : <IconChevronRight className="chevron" />
              ) : (
                <span className="chevron-placeholder" />
              )}
              {isExpanded ? <IconFolderOpen className="folder-icon" /> : <IconFolder className="folder-icon" />}
            </>
          ) : (
            <>
              <span className="chevron-placeholder" />
              <IconFileCode className="file-icon" />
            </>
          )}
          <span className="file-name">{item.name}</span>
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div className="folder-children">
            {item.children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarItems = [
    { icon: IconCode, label: 'Explorer', active: true },
    { icon: IconSearch, label: 'Search', active: false },
    { icon: IconTerminal, label: 'Terminal', active: false },
    { icon: IconDatabase, label: 'Database', active: false },
    { icon: IconServer, label: 'Server', active: false },
    { icon: IconCloud, label: 'Deploy', active: false },
    { icon: IconSettings, label: 'Settings', active: false }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IconChevronRight className={collapsed ? 'rotate-180' : ''} />
        </button>
        {!collapsed && <h3>Workspace</h3>}
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-tabs">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-tab ${item.active ? 'active' : ''}`}
                title={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-content">
            <div className="file-explorer">
              <div className="explorer-header">
                <span>EXPLORER</span>
                <button className="add-file-btn" title="New file">
                  <IconPlus />
                </button>
              </div>
              
              <div className="file-tree">
                {fileStructure.map(item => renderFileItem(item))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
