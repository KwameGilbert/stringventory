import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  red: {
    id: 'red',
    name: 'Red',
    sidebarBg: 'bg-slate-900',
    logoGradient: 'bg-red-500',
    logoIcon: 'text-white',
    activeMenuGradient: 'bg-red-500',
    activeMenuShadow: '',
    menuHoverBg: 'hover:bg-slate-700/50',
    menuHoverText: 'group-hover:text-red-400',
    profileGradient: 'bg-red-500',
    focusRing: 'focus:ring-2 focus:ring-red-500',
    buttonGradient: 'bg-red-500',
    buttonHover: 'hover:bg-red-600',
    textColor: 'text-red-600',
    textHover: 'hover:text-red-700',
    bgPrimary: 'bg-red-500',
    bgSecondary: 'bg-red-600',
    bgTertiary: 'bg-red-700',
    // New properties
    selectionBg: 'bg-red-50',
    selectionText: 'text-red-600',
    pageGradient: 'bg-gradient-to-br from-red-50 via-orange-50 to-rose-50',
    decorativeCircle1: 'bg-red-200',
    decorativeCircle2: 'bg-orange-200',
    decorativeCircle3: 'bg-rose-200',
    strengthStrong: 'bg-red-500',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    sidebarBg: 'bg-slate-900',
    logoGradient: 'bg-orange-500',
    logoIcon: 'text-white',
    activeMenuGradient: 'bg-orange-500',
    activeMenuShadow: '',
    menuHoverBg: 'hover:bg-slate-700/50',
    menuHoverText: 'group-hover:text-orange-400',
    profileGradient: 'bg-orange-500',
    focusRing: 'focus:ring-2 focus:ring-orange-500',
    buttonGradient: 'bg-orange-500',
    buttonHover: 'hover:bg-orange-600',
    textColor: 'text-orange-600',
    textHover: 'hover:text-orange-700',
    bgPrimary: 'bg-orange-500',
    bgSecondary: 'bg-orange-600',
    bgTertiary: 'bg-orange-700',
    // New properties
    selectionBg: 'bg-orange-50',
    selectionText: 'text-orange-600',
    pageGradient: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    decorativeCircle1: 'bg-orange-200',
    decorativeCircle2: 'bg-amber-200',
    decorativeCircle3: 'bg-yellow-200',
    strengthStrong: 'bg-orange-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    sidebarBg: 'bg-slate-900',
    logoGradient: 'bg-emerald-500',
    logoIcon: 'text-white',
    activeMenuGradient: 'bg-emerald-500',
    activeMenuShadow: '',
    menuHoverBg: 'hover:bg-slate-700/50',
    menuHoverText: 'group-hover:text-emerald-400',
    profileGradient: 'bg-emerald-500',
    focusRing: 'focus:ring-2 focus:ring-emerald-500',
    buttonGradient: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-600',
    textColor: 'text-emerald-600',
    textHover: 'hover:text-emerald-700',
    bgPrimary: 'bg-emerald-500',
    bgSecondary: 'bg-emerald-600',
    bgTertiary: 'bg-emerald-700',
    // New properties
    selectionBg: 'bg-emerald-50',
    selectionText: 'text-emerald-600',
    pageGradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    decorativeCircle1: 'bg-emerald-200',
    decorativeCircle2: 'bg-teal-200',
    decorativeCircle3: 'bg-cyan-200',
    strengthStrong: 'bg-emerald-500',
  },
  green: {
    id: 'green',
    name: 'Green',
    sidebarBg: 'bg-slate-900',
    logoGradient: 'bg-green-500',
    logoIcon: 'text-white',
    activeMenuGradient: 'bg-green-500',
    activeMenuShadow: '',
    menuHoverBg: 'hover:bg-slate-700/50',
    menuHoverText: 'group-hover:text-green-400',
    profileGradient: 'bg-green-500',
    focusRing: 'focus:ring-2 focus:ring-green-500',
    buttonGradient: 'bg-green-500',
    buttonHover: 'hover:bg-green-600',
    textColor: 'text-green-600',
    textHover: 'hover:text-green-700',
    bgPrimary: 'bg-green-500',
    bgSecondary: 'bg-green-600',
    bgTertiary: 'bg-green-700',
    // New properties
    selectionBg: 'bg-green-50',
    selectionText: 'text-green-600',
    pageGradient: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
    decorativeCircle1: 'bg-green-200',
    decorativeCircle2: 'bg-emerald-200',
    decorativeCircle3: 'bg-teal-200',
    strengthStrong: 'bg-green-500',
  },
  emerald : {
    id: 'emerald ',
    name: 'emerald ',
    sidebarBg: 'bg-slate-900',
    logoGradient: 'bg-emerald-500',
    logoIcon: 'text-white',
    activeMenuGradient: 'bg-emerald-500',
    activeMenuShadow: '',
    menuHoverBg: 'hover:bg-slate-700/50',
    menuHoverText: 'group-hover:text-emerald-400',
    profileGradient: 'bg-emerald-500',
    focusRing: 'focus:ring-2 focus:ring-emerald-500',
    buttonGradient: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-600',
    textColor: 'text-emerald-600',
    textHover: 'hover:text-emerald-700',
    bgPrimary: 'bg-emerald-500',
    bgSecondary: 'bg-emerald-600',
    bgTertiary: 'bg-emerald-700',
    // New properties
    selectionBg: 'bg-emerald-50',
    selectionText: 'text-emerald-600',
    pageGradient: 'bg-gradient-to-br from-emerald-50 via-fuchsia-50 to-pink-50',
    decorativeCircle1: 'bg-emerald-200',
    decorativeCircle2: 'bg-fuchsia-200',
    decorativeCircle3: 'bg-pink-200',
    strengthStrong: 'bg-emerald-500',
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  const value = {
    theme: currentTheme,
    themeColors: themes[currentTheme],
    setTheme: setCurrentTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
