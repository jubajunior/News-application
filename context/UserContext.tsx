import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface ExtendedUser extends User {
  password?: string;
}

interface UserContextType {
  users: ExtendedUser[];
  addUser: (user: Omit<ExtendedUser, 'id'>) => void;
  updateUser: (id: string, updates: Partial<ExtendedUser>) => void;
  deleteUser: (id: string) => void;
  getUserByEmail: (email: string) => ExtendedUser | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bn_users_list');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      // Default Admin User - Updated email to 'admin' to match demo credentials
      const defaultAdmin: ExtendedUser = {
        id: '1',
        name: 'Super Admin',
        role: 'ADMIN',
        email: 'admin',
        password: 'password',
        designation: 'Chief Editor',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
      setUsers([defaultAdmin]);
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('bn_users_list', JSON.stringify(users));
    }
  }, [users]);

  const addUser = (user: Omit<ExtendedUser, 'id'>) => {
    const newUser: ExtendedUser = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<ExtendedUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return; // Prevent deleting the last admin
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const getUserByEmail = (email: string) => users.find(u => u.email === email);

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUserByEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within a UserProvider');
  return context;
};