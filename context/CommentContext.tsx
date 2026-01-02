
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Comment } from '../types';

interface CommentContextType {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'status' | 'createdAt'>) => void;
  updateCommentStatus: (id: string, status: Comment['status']) => void;
  deleteComment: (id: string) => void;
  getCommentsByArticle: (articleId: string) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bn_comments_data');
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      // Mock initial comment
      setComments([
        {
          id: 'c1',
          articleId: '1',
          authorName: 'Sufian Ahmed',
          authorEmail: 'sufian@example.com',
          content: 'This is a very insightful update on the Bangladesh economy. Great to see the growth!',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bn_comments_data', JSON.stringify(comments));
  }, [comments]);

  const addComment = (comment: Omit<Comment, 'id' | 'status' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  const updateCommentStatus = (id: string, status: Comment['status']) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const getCommentsByArticle = (articleId: string) => 
    comments.filter(c => c.articleId === articleId && c.status === 'approved');

  return (
    <CommentContext.Provider value={{ comments, addComment, updateCommentStatus, deleteComment, getCommentsByArticle }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) throw new Error('useComments must be used within a CommentProvider');
  return context;
};
