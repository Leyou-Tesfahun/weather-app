// src/components/ThemeToggle.jsx
import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
