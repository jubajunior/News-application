import React, { createContext, useContext, useState, useEffect } from 'react';
import { Advertisement, AdPosition } from '../types';

interface AdContextType {
  ads: Advertisement[];
  addAd: (ad: Omit<Advertisement, 'id' | 'createdAt'>) => void;
  updateAd: (id: string, ad: Partial<Advertisement>) => void;
  deleteAd: (id: string) => void;
  toggleAdStatus: (id: string) => void;
  getAdsByPosition: (position: AdPosition) => Advertisement[];
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bn_ads_data');
    if (saved) {
      setAds(JSON.parse(saved));
    } else {
      // Mock initial ads
      setAds([
        {
          id: 'ad1',
          label: 'Summer Tech Sale',
          position: AdPosition.SIDEBAR,
          imageUrl: 'https://picsum.photos/seed/tech-ad/300/250',
          linkUrl: 'https://example.com',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ad2',
          label: 'Corporate Banking Solutions',
          position: AdPosition.HEADER,
          imageUrl: 'https://picsum.photos/seed/bank-ad/728/90',
          linkUrl: 'https://example.com',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bn_ads_data', JSON.stringify(ads));
  }, [ads]);

  const addAd = (ad: Omit<Advertisement, 'id' | 'createdAt'>) => {
    const newAd: Advertisement = {
      ...ad,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAds(prev => [newAd, ...prev]);
  };

  const updateAd = (id: string, updatedFields: Partial<Advertisement>) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
  };

  const toggleAdStatus = (id: string) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const getAdsByPosition = (position: AdPosition) => 
    ads.filter(a => a.position === position && a.isActive);

  return (
    <AdContext.Provider value={{ ads, addAd, updateAd, deleteAd, toggleAdStatus, getAdsByPosition }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used within an AdProvider');
  return context;
};