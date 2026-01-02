import React from 'react';
import { NewsItem } from '../types';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'large' | 'small' | 'minimal' | 'horizontal';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, variant = 'small' }) => {
  const { language, t, isRTL } = useLanguage();
  const formattedDate = new Date(item.publishedAt).toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const categoryLabel = t.categories[item.category] || item.category;

  if (variant === 'large') {
    return (
      <Link to={`/news/${item.id}`} className="group block relative overflow-hidden rounded-[2.5rem] shadow-2xl hover:shadow-red-900/10 transition-all duration-700">
        <div className="relative h-72 md:h-[500px] overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} flex gap-2`}>
            <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
              {categoryLabel}
            </span>
            {item.isBreaking && (
              <span className="bg-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                {t.breaking}
              </span>
            )}
          </div>

          <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} p-8 md:p-12 w-full`}>
            <div className="flex items-center gap-3 mb-4 text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
              <Clock size={14} className="text-red-500" />
              <span>{formattedDate}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span>{t.by} {item.author}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-[1.1] text-white group-hover:text-red-400 transition-colors mb-4 line-clamp-3">
              {item.title}
            </h2>
            <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-2xl font-medium">
              {item.excerpt}
            </p>
          </div>
          
          <div className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'} w-12 h-12 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500`}>
            <ArrowUpRight className={`text-red-600 ${isRTL ? 'rotate-[-90deg]' : ''}`} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/news/${item.id}`} className="group flex gap-5 items-center p-3 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
        <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">{categoryLabel}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span className="text-slate-400 text-[10px] font-bold">{formattedDate}</span>
          </div>
          <h3 className="font-extrabold text-slate-900 group-hover:text-red-700 line-clamp-2 leading-snug text-base transition-colors">
            {item.title}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link to={`/news/${item.id}`} className="group block py-4 border-b border-slate-100 last:border-0">
        <div className="flex gap-2 items-start">
          <div className="pt-1.5"><div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:scale-150 transition-transform"></div></div>
          <h3 className="font-bold text-sm text-slate-800 group-hover:text-red-700 transition-colors leading-relaxed">
            {item.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${item.id}`} className="group block bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-500 border border-slate-50">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
          <span className="glass px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/40">
            {categoryLabel}
          </span>
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
           <Clock size={12} className="text-red-600" />
           {formattedDate}
        </div>
        <h3 className="text-lg font-black text-slate-900 group-hover:text-red-700 transition-colors leading-tight mb-3 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default NewsCard;