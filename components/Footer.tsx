import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const nameParts = settings.siteName.split(' ');
  const mainName = nameParts.slice(0, -1).join(' ');
  const lastPart = nameParts[nameParts.length - 1];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative flair */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-slate-800 to-red-600"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-24">
          {/* Brand & Info */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase flex items-center gap-2">
              <span className="text-white">{mainName}</span>
              <span className="text-red-600">{lastPart}</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm font-medium">
              Championing independent journalism and high-impact storytelling for the digital age. Majlis Kantho delivers precision reporting to your screen since 2010.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button 
                  key={i} 
                  type="button" 
                  className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-red-700 hover:border-red-700 transition-all duration-300 group cursor-pointer"
                >
                  <Icon size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">{t.home.toUpperCase()}</h4>
            <ul className="grid grid-cols-2 gap-y-4 text-[13px] text-slate-400 font-bold">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors uppercase tracking-wider">{t.home}</Link>
              </li>
              {settings.categories.map(cat => (
                <li key={cat}>
                  <Link to={`/category/${cat.toLowerCase()}`} className="hover:text-red-500 transition-colors uppercase tracking-wider">{t.categories[cat] || cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal/Trust */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">Trust Center</h4>
            <ul className="space-y-4 text-[13px] text-slate-400 font-bold">
              <li><Link to="/policy" className="hover:text-red-500 transition-colors">Editorial Policy</Link></li>
              <li><Link to="/fact-check" className="hover:text-red-500 transition-colors">Fact-Check Desk</Link></li>
              <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Ethics</Link></li>
              <li><Link to="/corrections" className="hover:text-red-500 transition-colors">Corrections</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">Contact Desk</h4>
            <ul className="space-y-6 text-[13px] text-slate-400 font-bold">
              <li className="flex gap-4"><MapPin size={20} className="text-red-600 flex-shrink-0" /> <span className="leading-relaxed">{settings.address}</span></li>
              <li className="flex gap-4 items-center"><Phone size={20} className="text-red-600 flex-shrink-0" /> {settings.contactPhone}</li>
              <li className="flex gap-4 items-center"><Mail size={20} className="text-red-600 flex-shrink-0" /> {settings.contactEmail}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
             <p>© {new Date().getFullYear()} {settings.siteName}. All Rights Reserved.</p>
             <div className="hidden sm:block h-3 w-[1px] bg-white/10"></div>
             <Link to="/sitemap" className="hover:text-white transition-colors">XML Sitemap</Link>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
          >
            <span>{t.backToTop}</span>
            <ArrowUp size={16} className="text-red-600 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;