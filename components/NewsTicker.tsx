import React from 'react';
import { Zap } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const NewsTicker: React.FC = () => {
  const { t } = useLanguage();
  const { news } = useNews();
  const navigate = useNavigate();
  
  const breakingItems = news.filter(item => item.isBreaking);

  if (breakingItems.length === 0) return null;

  return (
    <div className="bg-[#f1f5f9] border-b border-slate-200 overflow-hidden py-1.5 relative z-40">
      <div className="max-w-7xl mx-auto flex items-center px-4">
        {/* The Capsule Badge - Styled to match user reference image */}
        <div className="bg-[#cc392c] text-white px-5 py-2.5 rounded-full font-black flex items-center gap-2.5 text-[10px] md:text-xs uppercase tracking-[0.2em] z-10 shadow-lg shadow-red-900/10 whitespace-nowrap shrink-0">
          <Zap size={14} fill="white" className="animate-pulse" /> 
          {t.breaking.toUpperCase()}
        </div>
        
        {/* The Scrolling Content */}
        <div className="relative flex-1 overflow-hidden ml-6">
          <div className="flex animate-marquee whitespace-nowrap gap-12 py-2">
            {breakingItems.map((item, idx) => (
              <button 
                key={item.id} 
                onClick={() => navigate(`/news/${item.id}`)}
                className="text-[11px] font-black text-slate-700 hover:text-red-700 cursor-pointer transition-colors uppercase tracking-widest flex items-center gap-4 shrink-0"
              >
                {item.title}
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
            ))}
            {/* Duplicate for seamless infinite loop */}
            {breakingItems.map((item, idx) => (
              <button 
                key={`dup-${item.id}`} 
                onClick={() => navigate(`/news/${item.id}`)}
                className="text-[11px] font-black text-slate-700 hover:text-red-700 cursor-pointer transition-colors uppercase tracking-widest flex items-center gap-4 shrink-0"
              >
                {item.title}
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;