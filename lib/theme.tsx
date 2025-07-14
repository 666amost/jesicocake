'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<{theme: 'light'|'dark', setTheme: (t: 'light'|'dark')=>void}>({theme:'light', setTheme:()=>{}});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({children}:{children:React.ReactNode}) {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light'|'dark') || 'light';
    }
    return 'light';
  });
  useEffect(() => {
    document.documentElement.classList.remove('light','dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
} 