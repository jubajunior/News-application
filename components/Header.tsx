import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User as UserIcon, Bell, LayoutDashboard, MapPin, Languages, Globe, Zap, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { settings } = useSettings();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setSearchQuery('');
    }
  };

  const isNewsPage = location.pathname.startsWith('/news/');
  const nameParts = settings.siteName.split(' ');
  const mainName = nameParts.slice(0, -1).join(' ');
  const lastPart = nameParts[nameParts.length - 1];

  const langs: {code: Language, label: string}[] = [
    {code: 'bn', label: 'বাংলা'},
    {code: 'en', label: 'EN'},
    {code: 'ar', label: 'عربي'}
  ];

  return (
    <>
      {/* Top Utility Bar - Slim & Professional */}
      <div className={`bg-[#0f172a] text-white/60 text-[10px] py-2.5 px-6 flex justify-between items-center font-black uppercase tracking-[0.2em] border-b border-white/5 relative z-50 transition-all duration-500 ease-in-out ${isScrolled ? '-translate-y-full opacity-0 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
            <MapPin size={12} className="text-red-500" /> 
            {new Date().toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <div className="hidden sm:flex items-center gap-2 text-red-400">
            <Zap size={12} fill="currentColor" />
            <span className="animate-pulse">Live: Market Updates</span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-4">
            <Languages size={12} className="text-red-500" />
            {langs.map(l => (
              <button 
                key={l.code} 
                onClick={() => setLanguage(l.code)}
                className={`hover:text-white transition-all ${language === l.code ? 'text-white border-b-2 border-red-600 pb-0.5' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {isAuthenticated ? (
            <Link to="/admin" className="flex items-center gap-2 text-white hover:text-red-400 transition-all group">
              <div className="w-5 h-5 rounded-md bg-red-700 flex items-center justify-center text-[8px] font-black group-hover:scale-110 transition-transform">
                {user?.name[0]}
              </div>
              <span className="hidden sm:inline">{t.portal}</span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <UserIcon size={12} className="text-red-500" /> {t.login}
            </Link>
          )}
        </div>
      </div>

      {/* Main Navigation - Floating Glass Aesthetic */}
      <header className={`transition-all duration-500 z-50 ${isScrolled ? 'fixed top-0 left-0 right-0 py-2 px-4' : 'bg-white pt-8 pb-4'}`}>
        <div className={`max-w-[1440px] mx-auto transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/40 px-6' : 'px-8'}`}>
          
          {/* Reading Progress Bar (Embedded in Header when scrolled) */}
          {isScrolled && isNewsPage && (
            <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-slate-100 overflow-hidden rounded-full">
              <div className="h-full bg-red-600 transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            {/* Mobile Menu Trigger */}
            <div className="flex-1 lg:hidden">
              <button 
                type="button"
                className="p-3 -ml-3 text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-90"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
            </div>

            {/* Logo / Branding */}
            <Link to="/" className={`flex flex-col items-center group transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <h1 className="font-black tracking-tighter text-slate-900 uppercase flex items-center gap-1">
                <span className={`transition-all duration-500 ${isScrolled ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
                  {mainName}
                  <span className="text-red-700"> {lastPart}</span>
                </span>
              </h1>
              {!isScrolled && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="h-[1px] w-6 bg-slate-200"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{settings.siteTagline}</span>
                  <span className="h-[1px] w-6 bg-slate-200"></span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation Links (Only visible when scrolled for compact view) */}
            {isScrolled && (
              <nav className="hidden xl:flex items-center gap-8 ml-12">
                {settings.categories.slice(0, 5).map((cat) => (
                  <Link 
                    key={cat}
                    to={`/category/${cat.toLowerCase()}`} 
                    className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-red-700 transition-all hover:-translate-y-0.5"
                  >
                    {t.categories[cat] || cat}
                  </Link>
                ))}
              </nav>
            )}

            {/* Search & Icons */}
            <div className="flex items-center gap-3 flex-1 lg:flex-none justify-end">
              <form 
                onSubmit={handleSearchSubmit}
                className={`hidden lg:flex relative items-center transition-all duration-500 ${isSearchFocused ? 'w-80' : 'w-48'}`}
              >
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search} 
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-5 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-red-600/10 focus:bg-white transition-all shadow-inner"
                />
                <button type="submit" className={`absolute right-4 text-slate-400 transition-colors ${isSearchFocused ? 'text-red-600' : ''}`}>
                  <Search size={16} />
                </button>
              </form>
              
              <button className="p-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-2xl transition-all relative group active:scale-90">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white group-hover:animate-ping"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Bar - Secondary Navigation */}
      <nav className={`bg-white border-b border-slate-100 transition-all duration-500 overflow-x-auto no-scrollbar ${isScrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 py-4'}`}>
        <ul className="max-w-7xl mx-auto flex justify-center gap-10 px-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
          <li>
            <Link to="/" className={`relative pb-2 group hover:text-slate-900 ${location.pathname === '/' ? 'text-red-700' : ''}`}>
              {t.home}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-red-700 transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </li>
          {settings.categories.map((cat) => {
            const path = `/category/${cat.toLowerCase()}`;
            const isActive = location.pathname === path;
            return (
              <li key={cat}>
                <Link 
                  to={path} 
                  className={`relative pb-2 group hover:text-slate-900 ${isActive ? 'text-red-700' : ''}`}
                >
                  {t.categories[cat] || cat}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-red-700 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Sidebar - Interactive Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-700 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={`absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white p-10 flex flex-col shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{mainName}<span className="text-red-700"> {lastPart}</span></h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-900 hover:text-red-700 transition-all"><X size={24} /></button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mb-8">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search} 
              className="w-full bg-slate-100 border-none rounded-2xl pl-5 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-red-600/10 focus:bg-white transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </button>
          </form>
          
          <nav className="flex-1 overflow-y-auto space-y-12 pr-4">
            <div className="space-y-6">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 block ml-1">Editorial Sections</span>
              <ul className="space-y-4">
                <li>
                  <Link to="/" className="flex items-center justify-between group py-2" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-2xl font-black text-slate-900 group-hover:text-red-700 transition-colors">{t.home}</span>
                    <ArrowRight size={18} className="text-slate-200 group-hover:text-red-700 group-hover:translate-x-2 transition-all" />
                  </Link>
                </li>
                {settings.categories.map((cat) => (
                  <li key={cat}>
                    <Link 
                      to={`/category/${cat.toLowerCase()}`} 
                      className="flex items-center justify-between group py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl font-black text-slate-900 group-hover:text-red-700 transition-colors">{t.categories[cat] || cat}</span>
                      <ArrowRight size={18} className="text-slate-200 group-hover:text-red-700 group-hover:translate-x-2 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
             <div className="grid grid-cols-3 gap-2">
                {langs.map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => setLanguage(l.code)} 
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === l.code ? 'bg-red-700 text-white shadow-xl shadow-red-900/20' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {l.code}
                  </button>
                ))}
             </div>
             {isAuthenticated ? (
               <Link 
                to="/admin" 
                className="bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                onClick={() => setIsMenuOpen(false)}
               >
                  <LayoutDashboard size={20} className="text-red-600" /> {t.portal}
               </Link>
             ) : (
               <Link 
                to="/login" 
                className="bg-red-700 text-white p-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                onClick={() => setIsMenuOpen(false)}
               >
                  <UserIcon size={20} /> {t.login}
               </Link>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;