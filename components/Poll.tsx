import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { PieChart as ChartIcon, CheckCircle2, History, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePolls } from '../context/PollContext';

const Poll: React.FC = () => {
  const { t } = useLanguage();
  const { activePoll, archivedPolls, vote } = usePolls();
  const [voted, setVoted] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Check if user has already voted in this session for this poll
  useEffect(() => {
    if (activePoll) {
      const hasVoted = localStorage.getItem(`voted_${activePoll.id}`);
      if (hasVoted) setVoted(true);
      else setVoted(false);
    }
  }, [activePoll]);

  const handleVote = (index: number) => {
    if (activePoll && !voted) {
      vote(activePoll.id, index);
      setVoted(true);
      localStorage.setItem(`voted_${activePoll.id}`, 'true');
    }
  };

  if (!activePoll && archivedPolls.length === 0) return null;

  const yesterdayPoll = archivedPolls[0];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${showArchive ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600'}`}>
            {showArchive ? <History size={20} /> : <ChartIcon size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              {showArchive ? 'Past Consensus' : t.publicOpinion}
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              {showArchive ? 'Yesterday\'s Results' : 'Live Reader Voice'}
            </p>
          </div>
        </div>
        
        {yesterdayPoll && (
          <button 
            onClick={() => setShowArchive(!showArchive)}
            className="text-[9px] font-black uppercase tracking-widest text-red-700 hover:text-red-900 transition-colors flex items-center gap-1"
          >
            {showArchive ? <><TrendingUp size={12}/> Live Poll</> : <><History size={12}/> See Yesterday</>}
          </button>
        )}
      </div>
      
      {!showArchive ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p className="text-base font-bold text-slate-800 mb-8 leading-snug">
            {activePoll?.question || 'No active polls at the moment.'}
          </p>
          
          {activePoll && (!voted ? (
            <div className="space-y-4">
              {activePoll.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  className="group w-full flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-red-600 hover:bg-white transition-all shadow-sm active:scale-95"
                >
                  <span className="font-black text-slate-600 group-hover:text-red-700 transition-colors uppercase text-xs tracking-widest">{opt.label}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-red-600 transition-colors"></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activePoll.options} layout="vertical" margin={{ left: -20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="label" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={24}>
                      {activePoll.options.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#cc392c' : index === 1 ? '#0f172a' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-2xl flex items-center gap-3 text-green-800 text-xs font-bold border border-green-100">
                 <CheckCircle2 size={18} className="text-green-600" />
                 {t.voteSuccess}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <p className="text-sm font-bold text-slate-800 mb-6 leading-snug">
            {yesterdayPoll.question}
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yesterdayPoll.options} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} />
                <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={20}>
                  {yesterdayPoll.options.map((entry, index) => (
                    <Cell key={`cell-arch-${index}`} fill="#cbd5e1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
            Total participants: {yesterdayPoll.options.reduce((sum, o) => sum + o.votes, 0)} readers
          </p>
        </div>
      )}
    </div>
  );
};

export default Poll;