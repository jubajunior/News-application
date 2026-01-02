import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useUsers } from './UserContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, updateUser } = useUsers();

  useEffect(() => {
    const savedUser = localStorage.getItem('bn_auth_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Verify if user still exists in UserContext
      const exists = users.find(u => u.id === parsed.id);
      if (exists) {
        setUser(exists);
      } else {
        localStorage.removeItem('bn_auth_user');
      }
    }
    setLoading(false);
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass as User);
      localStorage.setItem('bn_auth_user', JSON.stringify(userWithoutPass));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bn_auth_user');
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      updateUser(user.id, profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('bn_auth_user', JSON.stringify(updatedUser));
    }
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    
    const currentUserInList = users.find(u => u.id === user.id);
    if (!currentUserInList || currentUserInList.password !== currentPass) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    updateUser(user.id, { password: newPass });
    return { success: true, message: 'Password updated successfully!' };
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUserProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};