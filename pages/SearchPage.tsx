import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import NewsCard from '../components/NewsCard';
import { Search, ChevronRight, AlertCircle } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { news } = useNews();
  const { t } = useLanguage();

  const results = news.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    item.content.toLowerCase().includes(query.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-12 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
          <Link to="/" className="hover:text-red-700 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Search Results</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl shadow-slate-900/10">
              <Search size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
                {results.length} Results for <span className="text-red-700">"{query}"</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Found in editorial database</p>
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {results.map(item => (
            <NewsCard key={item.id} item={item} variant="small" />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
            <AlertCircle size={48} className="text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">No Stories Found</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            We couldn't find any articles matching your search criteria. Try using different keywords or exploring our categories.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95">
              Back to Cover
            </Link>
          </div>
        </div>
      )}

      {/* Recommended for you section when no results */}
      {results.length === 0 && news.length > 0 && (
        <section className="mt-24 pt-16 border-t border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-8 bg-red-700 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Staff Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.slice(0, 4).map(item => (
              <NewsCard key={item.id} item={item} variant="small" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default SearchPage;