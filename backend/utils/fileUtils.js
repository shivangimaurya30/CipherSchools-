export function getLanguageFromExtension(filename) {
  if (!filename) return 'plaintext';
  
  const ext = filename.split('.').pop().toLowerCase();
  
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'rb': 'ruby',
    'php': 'php',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'go': 'go',
    'rs': 'rust',
    'vue': 'vue',
    'svelte': 'svelte',
  };

  return languageMap[ext] || 'plaintext';
}