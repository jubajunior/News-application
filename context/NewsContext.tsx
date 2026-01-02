
import React, { createContext, useContext, useState, useEffect } from 'react';
// Fix: Removed 'Category' from imports as it is not exported from '../types' and is not used in this file.
import { NewsItem } from '../types';
import { MOCK_NEWS } from '../constants';

interface NewsContextType {
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id' | 'publishedAt'>) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  getNewsById: (id: string) => NewsItem | undefined;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);

  // Initialize from localStorage or Mock
  useEffect(() => {
    const saved = localStorage.getItem('bn_news_data');
    if (saved) {
      setNews(JSON.parse(saved));
    } else {
      setNews(MOCK_NEWS);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('bn_news_data', JSON.stringify(news));
    }
  }, [news]);

  const addNews = (item: Omit<NewsItem, 'id' | 'publishedAt'>) => {
    const newItem: NewsItem = {
      ...item,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    };
    setNews(prev => [newItem, ...prev]);
  };

  const updateNews = (id: string, updatedFields: Partial<NewsItem>) => {
    setNews(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  const getNewsById = (id: string) => news.find(n => n.id === id);

  return (
    <NewsContext.Provider value={{ news, addNews, updateNews, deleteNews, getNewsById }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within a NewsProvider');
  return context;
};
