import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const translations: Record<Language, Translations> = {
  bn: {
    home: 'প্রচ্ছদ',
    latestNews: 'সর্বশেষ সংবাদ',
    breaking: 'ব্রেকিং',
    trending: 'আলোচিত',
    mostRead: 'সর্বাধিক পঠিত',
    search: 'অনুসন্ধান করুন...',
    login: 'লগইন',
    portal: 'পোর্টাল',
    mission: 'লক্ষ্য',
    archive: 'আর্কাইভ',
    stayUpdated: 'সংযুক্ত থাকুন',
    newsletterDesc: 'প্রতিদিন সকালে আপনার ইনবক্সে সরাসরি সংবাদ শিরোনাম পান।',
    joinNewsletter: 'নিউজলেটার যোগ দিন',
    publicOpinion: 'জনমত',
    voteSuccess: 'ভোট রেকর্ড করা হয়েছে। অংশগ্রহণের জন্য ধন্যবাদ।',
    by: 'কর্তৃক',
    readMore: 'আরও পড়ুন',
    backToTop: 'উপরে যান',
    categories: {
      National: 'জাতীয়',
      International: 'আন্তর্জাতিক',
      Politics: 'রাজনীতি',
      Economy: 'অর্থনীতি',
      Sports: 'খেলাধুলা',
      Entertainment: 'বিনোদন',
      Religion: 'ধর্ম',
      Education: 'শিক্ষা',
      Technology: 'তথ্যপ্রযুক্তি'
    }
  },
  en: {
    home: 'Home',
    latestNews: 'Latest News',
    breaking: 'Breaking',
    trending: 'Trending',
    mostRead: 'Most Read',
    search: 'Search portal...',
    login: 'Login',
    portal: 'Portal',
    mission: 'Mission',
    archive: 'Archive',
    stayUpdated: 'Stay Updated',
    newsletterDesc: 'Get the morning headlines delivered directly to your inbox every single day.',
    joinNewsletter: 'Join Newsletter',
    publicOpinion: 'Public Opinion',
    voteSuccess: 'Voice recorded. Thank you for participating.',
    by: 'By',
    readMore: 'Read More',
    backToTop: 'Back to top',
    categories: {
      National: 'National',
      International: 'International',
      Politics: 'Politics',
      Economy: 'Economy',
      Sports: 'Sports',
      Entertainment: 'Entertainment',
      Religion: 'Religion',
      Education: 'Education',
      Technology: 'Technology'
    }
  },
  ar: {
    home: 'الرئيسية',
    latestNews: 'آخر الأخبار',
    breaking: 'عاجل',
    trending: 'رائج',
    mostRead: 'الأكثر قراءة',
    search: 'البحث في البوابة...',
    login: 'تسجيل الدخول',
    portal: 'البوابة',
    mission: 'مهمتنا',
    archive: 'الأرشيف',
    stayUpdated: 'ابق على اطلاع',
    newsletterDesc: 'احصل على عناوين الأخبار الصباحية في بريدك الإلكتروني كل يوم.',
    joinNewsletter: 'انضم للنشرة الإخبارية',
    publicOpinion: 'الرأي العام',
    voteSuccess: 'تم تسجيل صوتك. شكرا لمشاركتك.',
    by: 'بواسطة',
    readMore: 'اقرأ المزيد',
    backToTop: 'العودة للأعلى',
    categories: {
      National: 'الوطنية',
      International: 'الدولية',
      Politics: 'السياسة',
      Economy: 'الاقتصاد',
      Sports: 'الرياضة',
      Entertainment: 'الترفيه',
      Religion: 'الدين',
      Education: 'التعليم',
      Technology: 'التكنولوجيا'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('bn_lang');
    // Defaulting to 'en' (English) as per request
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('bn_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translations[language],
      isRTL: language === 'ar'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};