import { useState } from 'react';
import { 
  IconFile, 
  IconFolder, 
  IconFolderOpen, 
  IconChevronRight, 
  IconChevronDown,
  IconTrash,
  IconCode,
  IconFileText,
  IconFileCode,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';

const FileTreeItem = ({
  item,
  level = 0,
  onFileSelect,
  onFileDelete,
  selectedFileId,
  setCurrentFolderId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isFolder = item.type === 'folder';
  const childFiles = item.children || [];
  const isSelected = item._id === selectedFileId;

  const getFileIcon = (fileName, isFolder, isExpanded) => {
    if (isFolder) {
      return isExpanded ? 
        <IconFolderOpen className="w-4 h-4 text-blue-400" /> : 
        <IconFolder className="w-4 h-4 text-blue-400" />;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <IconCode className="w-4 h-4 text-yellow-400" />;
      case 'ts':
      case 'tsx':
        return <IconCode className="w-4 h-4 text-blue-400" />;
      case 'css':
        return <IconCode className="w-4 h-4 text-pink-400" />;
      case 'html':
        return <IconCode className="w-4 h-4 text-orange-400" />;
      case 'json':
        return <IconFileCode className="w-4 h-4 text-green-400" />;
      case 'md':
        return <IconFileText className="w-4 h-4 text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <IconPhoto className="w-4 h-4 text-purple-400" />;
      case 'config':
      case 'env':
        return <IconSettings className="w-4 h-4 text-gray-500" />;
      default:
        return <IconFile className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
      setCurrentFolderId(item._id);
    } else {
      onFileSelect(item);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      onFileDelete(item._id);
    }
  };

  return (
    <>
      <div 
        className={`file-tree-item group ${isSelected ? 'selected' : ''}`}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        <div className="file-tree-item-content">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {isFolder && (
              <div className="flex-shrink-0">
                {expanded ? (
                  <IconChevronDown className="w-3 h-3 text-gray-400" />
                ) : (
                  <IconChevronRight className="w-3 h-3 text-gray-400" />
                )}
              </div>
            )}
            <div className="flex-shrink-0">
              {getFileIcon(item.name, isFolder, expanded)}
            </div>
            <span className="file-name truncate">{item.name}</span>
          </div>
          <button
            className="file-delete-btn opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
            title={`Delete ${item.name}`}
          >
            <IconTrash className="w-3 h-3 text-red-400 hover:text-red-300" />
          </button>
        </div>
      </div>
      {isFolder && expanded && (
        <div className="file-tree-children">
          {childFiles.length > 0 ? (
            childFiles.map((child) => (
              <FileTreeItem
                key={child._id}
                item={child}
                level={level + 1}
                onFileSelect={onFileSelect}
                onFileDelete={onFileDelete}
                selectedFileId={selectedFileId}
                setCurrentFolderId={setCurrentFolderId}
              />
            ))
          ) : (
            <div 
              className="file-tree-empty"
              style={{ marginLeft: `${(level + 1) * 16}px` }}
            >
              <span className="text-gray-500 text-xs italic">Empty folder</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default function FileTree({
  files,
  onFileSelect,
  onFileDelete,
  selectedFileId,
  setCurrentFolderId,
}) {
  const buildFileTree = (filesList) => {
    const root = {
      _id: 'root',
      name: '',
      type: 'folder',
      children: [],
    };

    const fileMap = new Map();
    fileMap.set('root', root);

    // Create nodes for each file/folder
    filesList.forEach((file) => {
      fileMap.set(file._id, { ...file, children: [] });
    });

    // Build tree structure
    filesList.forEach((file) => {
      const parent = file.parentId ? fileMap.get(file.parentId) : root;
      if (parent) {
        parent.children.push(fileMap.get(file._id));
      }
    });

    return root.children;
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="file-tree">
      {fileTree.length > 0 ? (
        fileTree.map((item) => (
          <FileTreeItem
            key={item._id}
            item={item}
            onFileSelect={onFileSelect}
            onFileDelete={onFileDelete}
            selectedFileId={selectedFileId}
            setCurrentFolderId={setCurrentFolderId}
          />
        ))
      ) : (
        <div className="file-tree-empty text-center py-8">
          <IconFolder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No files yet</p>
          <p className="text-gray-600 text-xs mt-1">Create your first file to get started</p>
        </div>
      )}
    </div>
  );
}