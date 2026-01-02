import React, { createContext, useContext, useState, useEffect } from 'react';
import { Poll, PollOption } from '../types';

interface PollContextType {
  polls: Poll[];
  activePoll: Poll | null;
  archivedPolls: Poll[];
  addPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'isActive'>) => void;
  updatePoll: (id: string, poll: Partial<Poll>) => void;
  vote: (pollId: string, optionIndex: number) => void;
  archivePoll: (id: string) => void;
  deletePoll: (id: string) => void;
  activatePoll: (id: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bn_polls_data');
    if (saved) {
      setPolls(JSON.parse(saved));
    } else {
      // Default Polls
      const initialPolls: Poll[] = [
        {
          id: 'p1',
          question: 'Do you support the implementation of new digital infrastructure taxes proposed for FY 2024-25?',
          options: [
            { label: 'Yes', votes: 1240 },
            { label: 'No', votes: 850 },
            { label: 'Unsure', votes: 200 }
          ],
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'p0',
          question: 'Should public transport in the capital be fully electrified by 2030?',
          options: [
            { label: 'Strongly Agree', votes: 3400 },
            { label: 'Neutral', votes: 450 },
            { label: 'Disagree', votes: 120 }
          ],
          isActive: false,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setPolls(initialPolls);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bn_polls_data', JSON.stringify(polls));
  }, [polls]);

  const addPoll = (poll: Omit<Poll, 'id' | 'createdAt' | 'isActive'>) => {
    // Only one active poll at a time, deactivating others
    const newPoll: Poll = {
      ...poll,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setPolls(prev => [newPoll, ...prev.map(p => ({ ...p, isActive: false }))]);
  };

  const updatePoll = (id: string, updatedFields: Partial<Poll>) => {
    setPolls(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const vote = (pollId: string, optionIndex: number) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const newOptions = [...p.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], votes: newOptions[optionIndex].votes + 1 };
        return { ...p, options: newOptions };
      }
      return p;
    }));
  };

  const archivePoll = (id: string) => {
    setPolls(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p));
  };

  const activatePoll = (id: string) => {
    setPolls(prev => prev.map(p => ({
      ...p,
      isActive: p.id === id
    })));
  };

  const deletePoll = (id: string) => {
    setPolls(prev => prev.filter(p => p.id !== id));
  };

  const activePoll = polls.find(p => p.isActive) || null;
  const archivedPolls = polls.filter(p => !p.isActive).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <PollContext.Provider value={{ polls, activePoll, archivedPolls, addPoll, updatePoll, vote, archivePoll, deletePoll, activatePoll }}>
      {children}
    </PollContext.Provider>
  );
};

export const usePolls = () => {
  const context = useContext(PollContext);
  if (!context) throw new Error('usePolls must be used within a PollProvider');
  return context;
};