import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('eco_samudra_palette') || 'cyan';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-cyan', 'theme-sapphire', 'theme-teal');
    
    if (theme === 'sapphire') {
      root.classList.add('theme-sapphire');
    } else if (theme === 'teal') {
      root.classList.add('theme-teal');
    } else {
      root.classList.add('theme-cyan');
    }
    
    localStorage.setItem('eco_samudra_palette', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'cyan') return 'sapphire';
      if (prev === 'sapphire') return 'teal';
      return 'cyan';
    });
  };

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return { theme, cycleTheme, setSpecificTheme };
};
