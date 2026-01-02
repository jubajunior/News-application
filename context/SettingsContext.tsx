import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Majlis Kantho',
  siteTagline: 'Credible. Fast. Local.',
  contactEmail: 'contact@majliskantho.com',
  contactPhone: '+880 2 9876543',
  address: 'Plot 15, Block B, Bashundhara, Dhaka',
  isMaintenanceMode: false,
  enableAiSummaries: true,
  breakingNewsCount: 5,
  categories: [
    'National',
    'International',
    'Politics',
    'Economy',
    'Sports',
    'Entertainment',
    'Religion',
    'Education',
    'Technology'
  ]
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('bn_site_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('bn_site_settings', JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};