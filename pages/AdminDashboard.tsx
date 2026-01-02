import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, MessageSquare, Settings as SettingsIcon, LogOut, 
  Plus, Edit2, Trash2, X, Check, Bell, Save, Globe, ShieldAlert, Megaphone, 
  Power, User as UserIcon, Camera, Twitter, Facebook, Linkedin, Lock, Key, 
  ShieldCheck, AlertTriangle, Menu, Users, Mail, UserPlus, PieChart as PollIcon, 
  Archive, Image as ImageIcon, Link as LinkIcon, ExternalLink, Calendar, Zap, TrendingUp, Star
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useComments } from '../context/CommentContext';
import { useAds } from '../context/AdContext';
import { useUsers } from '../context/UserContext';
import { usePolls } from '../context/PollContext';
import { NewsItem, AdPosition, User, Advertisement, Poll } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useNews();
  const { user, logout, updateUserProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { comments, updateCommentStatus, deleteComment } = useComments();
  const { ads, addAd, updateAd, deleteAd, toggleAdStatus } = useAds();
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { polls, addPoll, updatePoll, deletePoll, activatePoll } = usePolls();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal states
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  
  // Editing states
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nameParts = settings.siteName.split(' ');
  const mainName = nameParts.slice(0, -1).join(' ');
  const lastPart = nameParts[nameParts.length - 1];

  // --- REUSABLE COMPONENTS ---

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any; label: string; id: string }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
          isActive 
            ? 'bg-red-700 text-white shadow-lg shadow-red-900/20' 
            : 'text-white/40 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-red-500 transition-colors'} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </button>
    );
  };

  // The Status Square Toggle - Styled to match user reference image
  const StatusToggle = ({ 
    active, 
    onClick, 
    label, 
    icon: Icon 
  }: { 
    active: boolean; 
    onClick: () => void; 
    label: string; 
    icon: any 
  }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex items-center gap-3 group/toggle cursor-pointer"
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${active ? 'bg-[#cc392c] shadow-lg shadow-red-900/20 rotate-0' : 'bg-slate-200 group-hover/toggle:bg-slate-300'}`}>
        <Icon size={14} className={`transition-all ${active ? 'text-white scale-100' : 'text-slate-400 scale-75'}`} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>
        {label}
      </span>
    </button>
  );

  // --- SUB-VIEWS ---

  const DashboardView = () => {
    const stats = [
      { label: 'Total Stories', value: news.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Consensus Base', value: (polls || []).reduce((sum, p) => sum + (p.options || []).reduce((s, o) => s + o.votes, 0), 0), icon: PollIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Moderation Queue', value: comments.filter(c => c.status === 'pending').length, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'Live Campaigns', value: ads.filter(a => a.isActive).length, icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}>
                  <s.icon size={28} />
                </div>
              </div>
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</h3>
              <p className="text-4xl font-black text-gray-900 mt-2">{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Pulse Ribbon</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div><span className="text-[10px] font-black uppercase text-slate-400">Streaming Live</span></div>
                </div>
             </div>
             <div className="space-y-4">
                {news.filter(n => n.isBreaking).slice(0, 5).map(item => (
                   <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0"><Zap size={14} fill="currentColor"/></div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                      </div>
                      <button onClick={() => updateNews(item.id, { isBreaking: false })} className="text-[9px] font-black text-slate-400 hover:text-red-700 uppercase">Remove</button>
                   </div>
                ))}
                {news.filter(n => n.isBreaking).length === 0 && <p className="text-center py-10 text-slate-300 text-xs font-bold uppercase tracking-widest">No Breaking Stories Active</p>}
             </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Featured Story</h3>
                <button onClick={() => setActiveTab('posts')} className="text-[10px] font-black uppercase text-red-700 hover:underline">Switch Featured</button>
             </div>
             {news.find(n => n.isFeatured) ? (
               <div className="relative rounded-3xl overflow-hidden group">
                  <img src={news.find(n => n.isFeatured)?.imageUrl} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <p className="text-white font-black text-base line-clamp-2">{news.find(n => n.isFeatured)?.title}</p>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">{news.find(n => n.isFeatured)?.category}</p>
                  </div>
               </div>
             ) : (
               <div className="h-48 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Featured Headline Selected</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  const PostsView = () => {
    const [formData, setFormData] = useState({
      title: '', category: settings.categories[0], excerpt: '', content: '', imageUrl: 'https://picsum.photos/800/600', author: user?.name || 'Admin', tags: '', isFeatured: false, isBreaking: false, isTrending: false
    });

    useEffect(() => {
      if (editingArticle) {
        setFormData({
          title: editingArticle.title,
          category: editingArticle.category,
          excerpt: editingArticle.excerpt,
          content: editingArticle.content,
          imageUrl: editingArticle.imageUrl,
          author: editingArticle.author,
          tags: editingArticle.tags.join(', '),
          isFeatured: !!editingArticle.isFeatured,
          isBreaking: !!editingArticle.isBreaking,
          isTrending: !!editingArticle.isTrending
        });
      } else {
        setFormData({
          title: '', category: settings.categories[0], excerpt: '', content: '', imageUrl: 'https://picsum.photos/800/600', author: user?.name || 'Admin', tags: '', isFeatured: false, isBreaking: false, isTrending: false
        });
      }
    }, [editingArticle]);

    // Live Toggling Logic
    const togglePulse = (id: string, key: 'isFeatured' | 'isBreaking' | 'isTrending') => {
      const article = news.find(n => n.id === id);
      if (!article) return;

      const newValue = !article[key as keyof NewsItem];
      
      // Enforce exclusivity for "Featured"
      if (key === 'isFeatured' && newValue) {
        news.forEach(item => {
          if (item.isFeatured && item.id !== id) {
            updateNews(item.id, { isFeatured: false });
          }
        });
      }

      updateNews(id, { [key]: newValue });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      if (payload.isFeatured) {
        news.forEach(item => {
          if (item.isFeatured && (!editingArticle || item.id !== editingArticle.id)) {
            updateNews(item.id, { isFeatured: false });
          }
        });
      }

      if (editingArticle) {
        updateNews(editingArticle.id, payload);
      } else {
        addNews(payload);
      }
      setIsArticleModalOpen(false);
      setEditingArticle(null);
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Editorial Content</h3>
            <p className="text-xs text-gray-400 mt-1">Manage all dispatches across the portal.</p>
          </div>
          <button 
            onClick={() => { setEditingArticle(null); setIsArticleModalOpen(true); }}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} /> New Article
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1100px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Story Details</th>
                <th className="px-8 py-5">Author</th>
                <th className="px-8 py-5">Pulse Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} className="w-16 h-12 rounded-xl object-cover shadow-sm" alt="" />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate max-w-xs">{item.title}</p>
                        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mt-1">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="font-semibold text-gray-600">{item.author}</span></td>
                  <td className="px-8 py-5">
                    {/* Integrated Pulse Toggle Hub */}
                    <div className="flex gap-10 items-center bg-slate-50/80 w-fit px-8 py-4 rounded-2xl border border-slate-100">
                      <StatusToggle 
                        active={!!item.isFeatured} 
                        onClick={() => togglePulse(item.id, 'isFeatured')} 
                        label="Featured" 
                        icon={Star} 
                      />
                      <StatusToggle 
                        active={!!item.isBreaking} 
                        onClick={() => togglePulse(item.id, 'isBreaking')} 
                        label="Breaking" 
                        icon={Zap} 
                      />
                      <StatusToggle 
                        active={!!item.isTrending} 
                        onClick={() => togglePulse(item.id, 'isTrending')} 
                        label="Trending" 
                        icon={TrendingUp} 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right space-x-1">
                    <button onClick={() => { setEditingArticle(item); setIsArticleModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => deleteNews(item.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isArticleModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{editingArticle ? 'Update Dispatch' : 'New Story Assembly'}</h2>
                  <button onClick={() => {setIsArticleModalOpen(false); setEditingArticle(null);}} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-700 transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Headline</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Section</label>
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                            {settings.categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Media URL</label>
                          <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Excerpt</label>
                        <textarea rows={3} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none resize-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Content Corpus</label>
                        <textarea required rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none resize-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Tags (Comma Separated)</label>
                        <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" placeholder="Economy, Budget, 2024" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <StatusToggle 
                        active={formData.isFeatured} 
                        onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})} 
                        label="Featured" 
                        icon={Star} 
                      />
                      <StatusToggle 
                        active={formData.isBreaking} 
                        onClick={() => setFormData({...formData, isBreaking: !formData.isBreaking})} 
                        label="Breaking" 
                        icon={Zap} 
                      />
                      <StatusToggle 
                        active={formData.isTrending} 
                        onClick={() => setFormData({...formData, isTrending: !formData.isTrending})} 
                        label="Trending" 
                        icon={TrendingUp} 
                      />
                  </div>

                  <button type="submit" className="w-full bg-red-700 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-900/10 active:scale-[0.98] transition-all">
                    {editingArticle ? 'Commit Updates' : 'Publish Dispatch'}
                  </button>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  };

  const TeamView = () => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'EDITOR' as User['role'], password: 'password', designation: '', avatarUrl: '' });

    useEffect(() => {
      if (editingUser) {
        setFormData({ name: editingUser.name, email: editingUser.email || '', role: editingUser.role, password: editingUser.password || 'password', designation: editingUser.designation || '', avatarUrl: editingUser.avatarUrl || '' });
      }
    }, [editingUser]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
        updateUser(editingUser.id, formData);
      } else {
        addUser(formData);
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Editorial Staff</h3>
            <p className="text-xs text-gray-400 mt-1">Control access and user roles for the portal.</p>
          </div>
          <button 
            onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Add Member
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
              <tr><th className="px-8 py-5">Staff Identity</th><th className="px-8 py-5">Role</th><th className="px-8 py-5 text-right">Operations</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name}`} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-700">{u.role}</span></td>
                  <td className="px-8 py-5 text-right space-x-1">
                    <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" disabled={u.id === user?.id}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isUserModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{editingUser ? 'Profile Adjustment' : 'Member Recruitment'}</h2>
                  <button onClick={() => {setIsUserModalOpen(false); setEditingUser(null);}} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-700 transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Email Anchor</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Editorial Role</label>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="REPORTER">REPORTER</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Access Key</label>
                      <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-red-700 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 active:scale-[0.98] transition-all">
                    {editingUser ? 'Save Profile Changes' : 'Onboard Member'}
                  </button>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  };

  const AdsView = () => {
    const [formData, setFormData] = useState({ label: '', position: AdPosition.SIDEBAR, imageUrl: 'https://picsum.photos/seed/ad/300/250', linkUrl: 'https://example.com', isActive: true });

    useEffect(() => {
      if (editingAd) {
        setFormData({ 
          label: editingAd.label, 
          position: editingAd.position, 
          imageUrl: editingAd.imageUrl, 
          linkUrl: editingAd.linkUrl, 
          isActive: editingAd.isActive 
        });
      }
    }, [editingAd]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingAd) {
        updateAd(editingAd.id, formData);
      } else {
        addAd(formData);
      }
      setIsAdModalOpen(false);
      setEditingAd(null);
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Campaign Management</h3>
            <p className="text-xs text-gray-400 mt-1">Control advertisement inventory and placement.</p>
          </div>
          <button 
            onClick={() => { setEditingAd(null); setIsAdModalOpen(true); }}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} /> New Campaign
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
              <tr><th className="px-8 py-5">Campaign Label</th><th className="px-8 py-5">Placement</th><th className="px-8 py-5">State</th><th className="px-8 py-5 text-right">Ops</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ads.map(ad => (
                <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={ad.imageUrl} className="w-12 h-10 rounded-lg object-cover" />
                      <p className="font-bold text-gray-900">{ad.label}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-widest rounded-md">{ad.position}</span></td>
                  <td className="px-8 py-5">
                    <button onClick={() => toggleAdStatus(ad.id)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      <Power size={14}/> {ad.isActive ? 'Active' : 'Offline'}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right space-x-1">
                    <button onClick={() => { setEditingAd(ad); setIsAdModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => deleteAd(ad.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAdModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{editingAd ? 'Campaign Revision' : 'Campaign Deployment'}</h2>
                  <button onClick={() => {setIsAdModalOpen(false); setEditingAd(null);}} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-700 transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Label</label>
                    <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Position</label>
                      <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value as any})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                        <option value={AdPosition.HEADER}>{AdPosition.HEADER}</option>
                        <option value={AdPosition.SIDEBAR}>{AdPosition.SIDEBAR}</option>
                        <option value={AdPosition.IN_CONTENT}>{AdPosition.IN_CONTENT}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Image Link</label>
                      <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Destination URL</label>
                    <input required type="text" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-red-700 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 active:scale-[0.98] transition-all">
                    {editingAd ? 'Commit Changes' : 'Initiate Campaign'}
                  </button>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  };

  const PollsView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Public Sentiment Controls</h3>
          <p className="text-xs text-gray-400 mt-1">Deploy reader polls to capture market consensus.</p>
        </div>
        <button 
          onClick={() => { setEditingPoll(null); setIsPollModalOpen(true); }}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} /> New Poll
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
            <tr><th className="px-8 py-5">Consensus Query</th><th className="px-8 py-5">Participation</th><th className="px-8 py-5">State</th><th className="px-8 py-5 text-right">Operations</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {polls.map((p) => {
              const totalVotes = (p.options || []).reduce((sum, opt) => sum + opt.votes, 0);
              return (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900 max-w-md">{p.question}</p>
                    <div className="flex gap-2 mt-2">
                      {(p.options || []).map((o, idx) => (
                        <span key={idx} className="text-[8px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{o.label}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5"><div className="flex items-center gap-2"><Users size={14} className="text-slate-400" /><span className="font-black text-slate-900">{totalVotes.toLocaleString()}</span></div></td>
                  <td className="px-8 py-5"><span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-400'}`}>{p.isActive ? 'Live' : 'Archived'}</span></td>
                  <td className="px-8 py-5 text-right space-x-1">
                    <button onClick={() => { setEditingPoll(p); setIsPollModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                    {!p.isActive && <button onClick={() => activatePoll(p.id)} className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"><Power size={18} /></button>}
                    <button onClick={() => deletePoll(p.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isPollModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{editingPoll ? 'Refine Query' : 'Poll Construction'}</h2>
                <button onClick={() => {setIsPollModalOpen(false); setEditingPoll(null);}} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-700 transition-all"><X size={24}/></button>
              </div>
              <PollForm onComplete={() => {setIsPollModalOpen(false); setEditingPoll(null);}} initialData={editingPoll} />
           </div>
        </div>
      )}
    </div>
  );

  const PollForm = ({ onComplete, initialData }: any) => {
    const [q, setQ] = useState(initialData?.question || '');
    const [opts, setOpts] = useState(initialData?.options?.map((o: any) => o.label) || ['', '', '']);
    
    const handleS = (e: React.FormEvent) => {
      e.preventDefault();
      const clean = opts.filter((o: string) => o.trim()).map((o: string) => {
        const existing = initialData?.options?.find((eo: any) => eo.label === o);
        return { label: o, votes: existing ? existing.votes : 0 };
      });
      if (clean.length < 2) return;
      
      if (initialData) {
        updatePoll(initialData.id, { question: q, options: clean });
      } else {
        addPoll({ question: q, options: clean });
      }
      onComplete();
    };

    return (
      <form onSubmit={handleS} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Consensus Question</label>
          <textarea required rows={2} value={q} onChange={e => setQ(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-red-700/5 outline-none transition-all resize-none" />
        </div>
        <div className="space-y-3">
           <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Options</label>
           {opts.map((opt: string, idx: number) => (
             <div key={idx} className="flex gap-2">
               <input required type="text" value={opt} onChange={e => { const n = [...opts]; n[idx] = e.target.value; setOpts(n); }} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none" placeholder={`Option ${idx + 1}`} />
               {opts.length > 2 && (
                 <button type="button" onClick={() => setOpts(opts.filter((_: any, i: number) => i !== idx))} className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
               )}
             </div>
           ))}
           <button type="button" onClick={() => setOpts([...opts, ''])} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-700 mt-2"><Plus size={14} /> Add Option</button>
        </div>
        <button type="submit" className="w-full bg-red-700 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 active:scale-[0.98] transition-all">
          {initialData ? 'Commit Revisions' : 'Deploy Consenus Query'}
        </button>
      </form>
    );
  };

  const CommentsView = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
          <tr><th className="px-8 py-5">Author</th><th className="px-8 py-5">Discourse</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Ops</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {comments.map((comment) => (
            <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-8 py-5"><p className="font-bold text-gray-900">{comment.authorName}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{comment.authorEmail}</p></td>
              <td className="px-8 py-5"><p className="text-gray-600 line-clamp-1 max-w-sm text-xs leading-relaxed">{comment.content}</p></td>
              <td className="px-8 py-5"><span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${comment.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>{comment.status}</span></td>
              <td className="px-8 py-5 text-right space-x-2">
                {comment.status === 'pending' && <button onClick={() => updateCommentStatus(comment.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Check size={16} /></button>}
                <button onClick={() => deleteComment(comment.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ProfileView = () => {
    const [form, setForm] = useState({ name: user?.name || '', designation: user?.designation || '', bio: user?.bio || '', avatarUrl: user?.avatarUrl || '' });
    return (
      <form onSubmit={(e) => { e.preventDefault(); updateUserProfile(form); }} className="max-w-4xl space-y-10">
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-12 items-start">
          <div className="relative group mx-auto md:mx-0">
             <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                <img src={form.avatarUrl || `https://ui-avatars.com/api/?name=${form.name}`} className="w-full h-full object-cover" />
             </div>
             <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-red-700 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"><Camera size={18} /></button>
          </div>
          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Full Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
              <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Corporate Designation</label><input type="text" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
            </div>
            <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Professional Biography</label><textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none resize-none" /></div>
            <button type="submit" className="bg-red-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all">Synchronize Profile</button>
          </div>
        </div>
      </form>
    );
  };

  const SettingsView = () => {
    const [form, setForm] = useState({ ...settings, categoriesString: settings.categories.join(', ') });
    return (
      <form onSubmit={(e) => { e.preventDefault(); updateSettings({ ...form, categories: form.categoriesString.split(',').map(c => c.trim()).filter(Boolean) }); }} className="max-w-4xl space-y-8">
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Portal Branding</label><input type="text" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
             <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Strategic Tagline</label><input type="text" value={form.siteTagline} onChange={e => setForm({...form, siteTagline: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
          </div>
          <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Section Taxonomy (Comma Separated)</label><input type="text" value={form.categoriesString} onChange={e => setForm({...form, categoriesString: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">HQ Phone</label><input type="text" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
             <div className="md:col-span-2"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 block">Corporate HQ Address</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black outline-none" /></div>
          </div>
          <button type="submit" className="bg-[#0f172a] text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Update Portal Parameters</button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans relative overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0f172a] border-r border-white/5 p-8 flex flex-col gap-10 z-[90] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              <span className="text-white group-hover:text-red-600 transition-colors">{mainName}</span>
              <span className="text-red-600 group-hover:text-white transition-colors"> {lastPart}</span>
            </h2>
          </Link>
          <button className="lg:hidden text-white/50" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>

        {user && (
          <div className="cursor-pointer" onClick={() => setActiveTab('profile')}>
            <div className="bg-white/5 rounded-[2.5rem] p-6 flex items-center gap-4 border border-white/5 hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0">
                <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=cc392c&color=fff`} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate text-white">{user.name}</p>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Strategic View" id="dash" />
          <SidebarItem icon={FileText} label="Editorial Wire" id="posts" />
          {user?.role === 'ADMIN' && <SidebarItem icon={Users} label="Team Assembly" id="team" />}
          <SidebarItem icon={PollIcon} label="Sentiment Desk" id="polls" />
          <SidebarItem icon={Megaphone} label="Campaign Hub" id="ads" />
          <SidebarItem icon={MessageSquare} label="Public Discourse" id="comments" />
          <div className="pt-10 mb-4 px-4"><span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Preferences</span></div>
          <SidebarItem icon={UserIcon} label="Member Profile" id="profile" />
          <SidebarItem icon={SettingsIcon} label="Portal Architect" id="settings" />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-400 px-4 py-4 w-full text-left font-black uppercase text-[10px] tracking-[0.2em] transition-colors border-t border-white/5 mt-6"><LogOut size={18} /> Terminal Exit</button>
      </aside>

      <main className="flex-1 min-w-0 bg-[#f8fafc] text-gray-900 overflow-y-auto pb-24">
        <header className="sticky top-0 z-[70] bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-red-700 transition-colors" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              {activeTab === 'dash' ? 'Executive Overview' : activeTab === 'team' ? 'Staff Control' : activeTab === 'profile' ? 'Member Identity' : activeTab.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
            </h1>
          </div>
          <Link to="/" className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-red-700 transition-all active:scale-95">
             <Globe size={16} className="text-red-600" /> Live Portal
          </Link>
        </header>

        <div className="p-10 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {activeTab === 'dash' && <DashboardView />}
           {activeTab === 'posts' && <PostsView />}
           {activeTab === 'team' && <TeamView />}
           {activeTab === 'polls' && <PollsView />}
           {activeTab === 'ads' && <AdsView />}
           {activeTab === 'comments' && <CommentsView />}
           {activeTab === 'profile' && <ProfileView />}
           {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;