import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sandpack } from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';
import {
  IconFile,
  IconFolder,
  IconPlus,
  IconArrowLeft,
  IconDeviceFloppy,
  IconCode,
  IconEye,
  IconSettings,
  IconMaximize,
  IconMinimize,
  IconRefresh,
  IconDownload,
  IconShare,
  IconTrash,
  IconEdit,
  IconChevronRight,
  IconChevronDown,
  IconX,
  IconMenu2,
  IconLayoutSidebar,
  IconLayoutSidebarRight,
} from '@tabler/icons-react';
import useProjectStore from '../../stores/projectStore';
import FileTree from './FileTree';
import ThemeToggle from '../common/ThemeToggle';
import { getLanguageFromExtension } from '../../utils/fileUtils';

export default function IDE() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    files,
    fetchProject,
    createFile,
    updateFile,
    deleteFile,
  } = useProjectStore();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [newFileModal, setNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('file');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState('split'); // 'split', 'editor', 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  const handleFileSelect = useCallback((file) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setFileContent(file.content || '');
    }
  }, []);

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    
    const file = await createFile(
      projectId,
      currentFolderId,
      newFileName,
      newFileType
    );
    if (file) {
      setNewFileModal(false);
      setNewFileName('');
      if (file.type === 'file') {
        handleFileSelect(file);
      }
    }
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;
    
    setIsSaving(true);
    try {
      await updateFile(selectedFile._id, { content: fileContent });
      // Show success feedback
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      setIsSaving(false);
      console.error('Failed to save file:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    const success = await deleteFile(fileId);
    if (success && selectedFile?._id === fileId) {
      setSelectedFile(null);
      setFileContent('');
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <IconCode className="w-4 h-4 text-blue-400" />;
      case 'css':
        return <IconCode className="w-4 h-4 text-pink-400" />;
      case 'html':
        return <IconCode className="w-4 h-4 text-orange-400" />;
      case 'json':
        return <IconCode className="w-4 h-4 text-yellow-400" />;
      default:
        return <IconFile className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="ide-page">
      {/* IDE Header */}
      <div className="ide-header">
        <div className="ide-header-left">
          <div className="project-info">
            <h2>{currentProject?.name}</h2>
            <span className="project-framework">{currentProject?.framework}</span>
          </div>
        </div>
        
        <div className="ide-header-right">
          {/* Preview Mode Toggle */}
          <div className="preview-mode-toggle">
            <button
              onClick={() => setPreviewMode('editor')}
              className={`preview-btn ${previewMode === 'editor' ? 'active' : ''}`}
            >
              <IconCode size={16} />
            </button>
            <button
              onClick={() => setPreviewMode('split')}
              className={`preview-btn ${previewMode === 'split' ? 'active' : ''}`}
            >
              Split
            </button>
            <button
              onClick={() => setPreviewMode('preview')}
              className={`preview-btn ${previewMode === 'preview' ? 'active' : ''}`}
            >
              <IconEye size={16} />
            </button>
          </div>

          {/* Save Button */}
          {selectedFile && (
            <button
              onClick={handleSaveFile}
              disabled={isSaving}
              className={`save-btn ${isSaving ? 'saving' : ''}`}
            >
              <IconDeviceFloppy size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <div className="ide-workspace">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 hidden md:flex flex-col">
            {/* File Explorer Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Explorer
                </h2>
                <button
                  onClick={() => setNewFileModal(true)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="New file/folder"
                >
                  <IconPlus className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-4">
              <FileTree
                files={files}
                onFileSelect={handleFileSelect}
                onFileDelete={handleDeleteFile}
                selectedFileId={selectedFile?._id}
                setCurrentFolderId={setCurrentFolderId}
              />
            </div>
          </div>
        )}

        {/* Mobile Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-full bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col md:hidden">
            {/* File Explorer Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Explorer
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNewFileModal(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="New file/folder"
                  >
                    <IconPlus className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Close sidebar"
                  >
                    <IconX className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-4">
          <FileTree
            files={files}
            onFileSelect={handleFileSelect}
            onFileDelete={handleDeleteFile}
            selectedFileId={selectedFile?._id}
            setCurrentFolderId={setCurrentFolderId}
          />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          {selectedFile && (
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(selectedFile.name)}
                  <span className="text-sm font-medium text-white">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400">
                    {getLanguageFromExtension(selectedFile.name)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    title="Toggle sidebar"
                  >
                    <IconLayoutSidebar className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Editor and Preview */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Editor */}
            {(previewMode === 'editor' || previewMode === 'split') && (
              <div className={`${previewMode === 'split' ? 'lg:w-1/2 w-full' : 'w-full'} flex flex-col`}>
        {selectedFile ? (
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage={getLanguageFromExtension(selectedFile.name)}
                      value={fileContent}
                      onChange={setFileContent}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-white/5">
                    <div className="text-center p-6">
                      <IconFile className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No file selected</h3>
                      <p className="text-gray-500 mb-4">Select a file from the explorer to start editing</p>
                      <button
                        onClick={() => setNewFileModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        <IconPlus className="w-4 h-4 mr-2" />
                        Create New File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {(previewMode === 'preview' || previewMode === 'split') && (
              <div className={`${previewMode === 'split' ? 'lg:w-1/2 w-full' : 'w-full'} flex flex-col border-t lg:border-t-0 lg:border-l border-white/10`}>
                <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconEye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-white">Preview</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <IconRefresh className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <IconMaximize className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white min-h-[300px]">
                  {selectedFile && (selectedFile.name.endsWith('.jsx') || selectedFile.name.endsWith('.js')) ? (
              <Sandpack
                template="react"
                files={{
                  '/App.js': fileContent,
                }}
                options={{
                        showNavigator: false,
                        showTabs: false,
                        showLineNumbers: false,
                        showRefreshButton: false,
                        showConsoleButton: false,
                        editorHeight: '100%',
                      }}
                      theme="dark"
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                      <div className="text-center p-6">
                        <IconEye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Preview not available</h3>
                        <p className="text-gray-500">Preview is only available for React components</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New File Modal */}
      {newFileModal && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setNewFileModal(false)} />
            
            <div className="relative inline-block bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl transform transition-all max-w-md w-full p-6 text-left align-middle border border-white/10">
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-300 focus:outline-none p-1 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setNewFileModal(false)}
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Create New {newFileType === 'file' ? 'File' : 'Folder'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {newFileType === 'file' 
                      ? 'Enter the filename with extension (e.g., App.jsx)' 
                      : 'Enter the folder name'
                    }
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-gray-600/50 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-colors"
                      placeholder={newFileType === 'file' ? 'App.jsx' : 'components'}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
                  </div>

                  <div className="flex space-x-2">
                    <button
              onClick={() => setNewFileType('file')}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 ${
                        newFileType === 'file'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-gray-600/50 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <IconFile className="w-4 h-4 mr-2" />
                      File
                    </button>
                    <button
              onClick={() => setNewFileType('folder')}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 ${
                        newFileType === 'folder'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-gray-600/50 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <IconFolder className="w-4 h-4 mr-2" />
              Folder
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleCreateFile}
                    disabled={!newFileName.trim()}
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <IconPlus className="w-4 h-4 mr-2" />
                    Create {newFileType === 'file' ? 'File' : 'Folder'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}