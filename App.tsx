import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsDetails from './pages/NewsDetails';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CommentProvider } from './context/CommentContext';
import { AdProvider } from './context/AdContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { PollProvider } from './context/PollContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';
  
  const hideStandardLayout = isAdminPath || isLoginPage;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideStandardLayout && (
        <>
          <Header />
          <NewsTicker />
        </>
      )}
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/category/:cat" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {!hideStandardLayout && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <UserProvider>
        <AuthProvider>
          <SettingsProvider>
            <CommentProvider>
              <AdProvider>
                <PollProvider>
                  <NewsProvider>
                    <MemoryRouter>
                      <AppContent />
                    </MemoryRouter>
                  </NewsProvider>
                </PollProvider>
              </AdProvider>
            </CommentProvider>
          </SettingsProvider>
        </AuthProvider>
      </UserProvider>
    </LanguageProvider>
  );
};

export default App;