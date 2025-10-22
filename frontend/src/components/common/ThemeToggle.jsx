import { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('cipherstudio-theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    
    localStorage.setItem('cipherstudio-theme', newTheme);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
      <button
        onClick={() => handleThemeChange('light')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-300 hover:bg-white/10'
        }`}
        title="Light theme"
      >
        <IconSun className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-indigo-500 text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-300 hover:bg-white/10'
        }`}
        title="Dark theme"
      >
        <IconMoon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleThemeChange('auto')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'auto'
            ? 'bg-gray-500 text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-300 hover:bg-white/10'
        }`}
        title="Auto theme (system preference)"
      >
        <IconDeviceDesktop className="w-4 h-4" />
      </button>
    </div>
  );
}

