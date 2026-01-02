import React from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import Poll from '../components/Poll';
import { useNews } from '../context/NewsContext';
import { useAds } from '../context/AdContext';
import { useLanguage } from '../context/LanguageContext';
import { AdPosition } from '../types';
import { TrendingUp, Clock, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { cat } = useParams<{ cat: string }>();
  const { news } = useNews();
  const { getAdsByPosition } = useAds();
  const { t } = useLanguage();
  
  const filteredNews = cat 
    ? news.filter(item => item.category.toLowerCase() === cat.toLowerCase())
    : news;

  const featured = filteredNews.find(item => item.isFeatured) || filteredNews[0];
  const trending = news.filter(item => item.isTrending); 
  const recent = filteredNews.filter(item => item.id !== featured?.id).slice(0, 6);

  const sidebarAds = getAdsByPosition(AdPosition.SIDEBAR);

  if (filteredNews.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Filter className="mx-auto text-gray-300 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase">No articles found</h2>
        <p className="text-gray-500">There are currently no articles in this section.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {cat && (
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1.5 h-10 bg-red-700 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              {t.categories[cat.charAt(0).toUpperCase() + cat.slice(1)] || cat}
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Showing latest stories in this section</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        <div className="lg:col-span-8 order-1">
          {featured && (
            <section className="mb-12">
              <NewsCard item={featured} variant="large" />
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-8 border-b-2 border-red-700 w-fit pb-1">
              <Clock className="text-red-700" size={20} />
              <h2 className="text-xl font-black text-gray-900 uppercase">
                {cat ? (t.categories[cat.charAt(0).toUpperCase() + cat.slice(1)] || cat) : t.latestNews}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
              {recent.map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10 order-2">
          {sidebarAds.length > 0 ? (
            <div className="space-y-6">
              {sidebarAds.map(ad => (
                <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-gray-100 shadow-md transition-transform hover:scale-[1.02] duration-300">
                  <img src={ad.imageUrl} alt={ad.label} className="w-full h-auto" title={ad.label} />
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 h-64 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-2xl">
              <Filter className="mb-2 opacity-20" size={32} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Advertisement</span>
            </div>
          )}

          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-red-700" size={20} />
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t.mostRead}</h2>
            </div>
            <div className="space-y-6">
              {trending.map((item, idx) => (
                <div key={item.id} className="flex gap-4 group">
                  <span className="text-3xl font-black text-gray-100 group-hover:text-red-100 transition-colors leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <NewsCard item={item} variant="minimal" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Poll />

          <section className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-xl font-black mb-3 tracking-tight">{t.stayUpdated}</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">{t.newsletterDesc}</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email..." 
                className="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-700 outline-none transition-all placeholder:text-gray-500"
              />
              <button type="submit" className="w-full bg-red-700 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg active:scale-95">{t.joinNewsletter}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;