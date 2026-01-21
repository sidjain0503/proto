'use client'

import { menuItems } from '@/app/menu';
import { createContext, useContext, useState } from 'react';


const AppStore = createContext(null);

export function AppStoreProvider({ children }) {

const [menuItem, setMenuItem] = useState(menuItems);

  const value = {
    menuItem,
    setMenuItem,
  };

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStore);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}

