import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { useComments } from '../context/CommentContext';
import { useAds } from '../context/AdContext';
import { useAuth } from '../context/AuthContext';
import { getAISummary } from '../services/geminiService';
import { AdPosition, NewsItem } from '../types';
import { 
  Facebook, 
  Twitter, 
  Link as LinkIcon, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Send, 
  Check, 
  Megaphone, 
  ThumbsUp, 
  ThumbsDown 
} from 'lucide-react';
import NewsCard from '../components/NewsCard';

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news, getNewsById } = useNews();
  const { getCommentsByArticle, addComment } = useComments();
  const { getAdsByPosition } = useAds();
  const { user } = useAuth();
  const article = getNewsById(id || '');
  
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // State for article rating system
  const [helpfulCount, setHelpfulCount] = useState(Math.floor(Math.random() * 45) + 12);
  const [notHelpfulCount, setNotHelpfulCount] = useState(Math.floor(Math.random() * 8));
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(null);

  // Carousel state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const approvedComments = getCommentsByArticle(id || '');
  const sidebarAds = getAdsByPosition(AdPosition.SIDEBAR);
  const inContentAds = getAdsByPosition(AdPosition.IN_CONTENT);

  useEffect(() => {
    if (article) {
      const fetchSummary = async () => {
        setIsLoadingSummary(true);
        const summary = await getAISummary(article.content);
        setAiSummary(summary || '');
        setIsLoadingSummary(false);
      };
      fetchSummary();
      window.scrollTo(0, 0);
      setAiSummary(''); // Clear old summary while loading new one
      setUserVote(null); // Reset vote for new article
      setCopied(false);
    }
  }, [article?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    addComment({
      articleId: id,
      authorName: commentForm.name,
      authorEmail: commentForm.email,
      content: commentForm.content,
    });
    
    setCommentForm({ name: '', email: '', content: '' });
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleVote = (type: 'helpful' | 'not-helpful') => {
    if (userVote) return;
    if (type === 'helpful') setHelpfulCount(prev => prev + 1);
    else setNotHelpfulCount(prev => prev + 1);
    setUserVote(type);
  };

  if (!article) return <div className="p-20 text-center">Article not found.</div>;

  const relatedNews = news
    .filter(n => n.id !== article.id && (n.category === article.category || n.tags.some(t => article.tags.includes(t))))
    .slice(0, 10);

  const isCurrentUserAuthor = article.author === user?.name;
  const authorDisplay = isCurrentUserAuthor && user ? {
    name: user.name,
    designation: user.designation || 'Staff Reporter',
    bio: user.bio || 'Our dedicated editorial team member covering national and international stories.',
    avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=cc392c&color=fff`
  } : {
    name: article.author,
    designation: 'Staff Reporter',
    bio: 'Our dedicated editorial team member covering national and international stories.',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=cc392c&color=fff`
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      const itemWidth = 340 + 32; // card width + gap
      setActiveIndex(Math.round(scrollLeft / itemWidth));
    }
  };

  useEffect(() => {
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => current?.removeEventListener('scroll', checkScroll);
  }, [relatedNews]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-red-700">Home</Link> / 
          <Link to={`/category/${article.category.toLowerCase()}`} className="hover:text-red-700"> {article.category}</Link>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img src={authorDisplay.avatar} alt={authorDisplay.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">{authorDisplay.name}</p>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest">{authorDisplay.designation}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button type="button" className="p-2 bg-blue-600 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm"><Facebook size={18} /></button>
            <button type="button" className="p-2 bg-sky-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm"><Twitter size={18} /></button>
            <button 
              type="button" 
              onClick={handleCopyLink}
              className={`p-2 rounded-full transition-all shadow-sm flex items-center justify-center ${copied ? 'bg-green-600 text-white scale-110' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Copy link to clipboard"
            >
              {copied ? <Check size={18} /> : <LinkIcon size={18} />}
            </button>
          </div>
        </div>

        <figure className="mb-10">
          <img src={article.imageUrl} alt={article.title} className="w-full h-auto rounded-[2.5rem] shadow-xl border border-gray-100" />
        </figure>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 mb-10 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest">AI Summary</h3>
              </div>
              {isLoadingSummary ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
                  <div className="h-4 bg-indigo-200/50 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                  {aiSummary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 mb-12">
              <p className="font-bold text-xl leading-snug text-gray-900 border-l-4 border-red-700 pl-6 py-2">{article.excerpt}</p>
              {article.content.split('\n').map((para, i) => (
                <React.Fragment key={i}>
                  <p>{para}</p>
                  {i === 1 && inContentAds.length > 0 && (
                    <div className="my-10 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                      <a href={inContentAds[0].linkUrl} target="_blank" rel="noreferrer">
                        <img src={inContentAds[0].imageUrl} alt={inContentAds[0].label} className="w-full h-auto" />
                      </a>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Article Rating Section */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div>
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-1">Was this article helpful?</h4>
                <p className="text-xs text-gray-500">Your feedback helps us improve our editorial quality.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleVote('helpful')}
                  disabled={userVote !== null}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                    userVote === 'helpful' ? 'bg-green-600 text-white scale-105' : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700'
                  } disabled:cursor-default`}
                >
                  <ThumbsUp size={16} /> Helpful ({helpfulCount})
                </button>
                <button 
                  onClick={() => handleVote('not-helpful')}
                  disabled={userVote !== null}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                    userVote === 'not-helpful' ? 'bg-red-600 text-white scale-105' : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-700'
                  } disabled:cursor-default`}
                >
                  <ThumbsDown size={16} /> Not Helpful ({notHelpfulCount})
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pb-12 border-b border-gray-100">
              {article.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer transition-all">#{tag}</span>
              ))}
            </div>

            {/* Comments Section */}
            <section className="mt-16">
              <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm mb-12">
                <h3 className="text-xs font-black text-[#1e293b] uppercase tracking-[0.2em] mb-8">Leave a Thought</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-8">
                  {showSuccess && (
                    <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 mb-4">
                      <Check size={18} className="text-green-600" /> Your comment has been submitted for moderation.
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name" 
                      value={commentForm.name}
                      onChange={e => setCommentForm({...commentForm, name: e.target.value})}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-6 py-4 text-sm font-medium text-[#1e293b] focus:ring-4 focus:ring-red-700/5 focus:border-red-600/30 outline-none transition-all" 
                    />
                    <input 
                      required
                      type="email" 
                      placeholder="Your Email" 
                      value={commentForm.email}
                      onChange={e => setCommentForm({...commentForm, email: e.target.value})}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-6 py-4 text-sm font-medium text-[#1e293b] focus:ring-4 focus:ring-red-700/5 focus:border-red-600/30 outline-none transition-all" 
                    />
                  </div>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Join the conversation..." 
                    value={commentForm.content}
                    onChange={e => setCommentForm({...commentForm, content: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-6 py-4 text-sm font-medium text-[#1e293b] focus:ring-4 focus:ring-red-700/5 focus:border-red-600/30 outline-none resize-none transition-all"
                  ></textarea>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#cc392c] hover:bg-[#b52a1e] text-white px-10 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all shadow-[0_10px_25px_-5px_rgba(204,57,44,0.3)] active:scale-95 disabled:opacity-50"
                  >
                    Post Comment <Send size={18} />
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-2 mb-10">
                <MessageCircle className="text-[#cc392c]" size={24} />
                <h2 className="text-2xl font-black text-[#1e293b] uppercase">Discussion ({approvedComments.length})</h2>
              </div>

              <div className="space-y-10">
                {approvedComments.map(comment => (
                  <div key={comment.id} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-[#f1f5f9] flex items-center justify-center font-black text-[#64748b] text-xl flex-shrink-0 group-hover:bg-[#e2e8f0] transition-colors">
                      {comment.authorName[0]}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-[#1e293b] text-base">{comment.authorName}</h4>
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wider">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-[#475569] leading-relaxed bg-[#f8fafc] border border-[#f1f5f9] p-6 rounded-3xl rounded-tl-none group-hover:border-[#e2e8f0] transition-all group-hover:shadow-sm">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-2 text-red-700 mb-4">
                    <AlertCircle size={18} />
                    <h4 className="font-black text-xs uppercase tracking-[0.15em]">Verified Content</h4>
                 </div>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">This report has been vetted by our fact-checking desk. We maintain 100% transparency in our news sourcing and editorial standards.</p>
              </div>
              
              {sidebarAds.length > 0 ? (
                <div className="space-y-4">
                  {sidebarAds.map(ad => (
                    <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-lg hover:scale-[1.02] transition-transform duration-300">
                      <img src={ad.imageUrl} alt={ad.label} className="w-full h-auto" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 h-64 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-[2rem]">
                  <Megaphone className="mb-2 opacity-30" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Advertisement</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Carousel Section */}
      {relatedNews.length > 0 && (
        <section className="mt-24 pt-16 border-t border-gray-100 overflow-hidden relative">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-10 bg-red-700 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Discover More Stories</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Based on your interests</p>
              </div>
            </div>
            
            <div className="hidden md:flex gap-3">
              <button 
                type="button" 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-4 rounded-full border border-gray-200 transition-all ${
                  canScrollLeft ? 'bg-white text-gray-900 hover:shadow-xl hover:-translate-x-1 active:scale-90 cursor-pointer' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                type="button" 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-4 rounded-full border border-gray-200 transition-all ${
                  canScrollRight ? 'bg-white text-gray-900 hover:shadow-xl hover:translate-x-1 active:scale-90 cursor-pointer' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="relative group/carousel">
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedNews.map((item) => (
                <div key={item.id} className="min-w-[280px] sm:min-w-[340px] snap-start transition-all duration-500 hover:scale-[1.02]">
                  <NewsCard item={item} variant="small" />
                </div>
              ))}
            </div>
            
            {/* Visual indicators (dots) */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.min(relatedNews.length, 5) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex % 5 === i ? 'w-8 bg-red-700' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </article>
  );
};

export default NewsDetails;