import React, { useState, useEffect } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import TopBar from './components/TopBar';
import { cn } from './lib/utils';
import Dashboard from './views/Dashboard';
import Submissions from './views/Submissions';
import SubmissionDetails from './views/SubmissionDetails';
import FormBuilder from './views/FormBuilder';
import FormList from './views/FormList';
import PublicForm from './views/PublicForm';
import Settings from './views/Settings';
import Profile from './views/Profile';
import WhatsAppSettings from './views/WhatsAppSettings';
import Login from './views/Login';
import { authService } from './services/authService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Cek apakah ada token di localStorage saat mount
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Opsional: Validasi token ke backend
          await authService.getMe();
          setIsAuthenticated(true);
        } catch (error) {
          // Token tidak valid/expired
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Event listener jika token expired (dipanggil dari lib/api.ts)
    const handleExpired = () => setIsAuthenticated(false);
    window.addEventListener('auth-expired', handleExpired);
    
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setIsAuthenticated(false);
      setCurrentView('overview');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Dashboard />;
      case 'orders':
        return <Submissions onSelectSubmission={() => setCurrentView('orderDetails')} />;
      case 'orderDetails':
        return <SubmissionDetails onBack={() => setCurrentView('orders')} />;
      case 'formList':
        return (
          <FormList 
            onCreateNew={() => setCurrentView('builder')} 
            onEdit={() => setCurrentView('builder')}
            onPreview={() => setCurrentView('publicForm')}
          />
        );
      case 'builder':
        return <FormBuilder onBack={() => setCurrentView('formList')} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'whatsapp':
        return <WhatsAppSettings />;
      case 'publicForm':
        return <PublicForm />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // Special layout for Public Form
  if (currentView === 'publicForm') {
    return <PublicForm />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex bg-surface-bright h-screen overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }} 
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className={cn(
          "flex-1",
          currentView === 'builder' ? "p-0 overflow-hidden" : "p-6 overflow-y-auto"
        )}>
          <div className={cn(
            "h-full",
            currentView !== 'builder' && "max-w-7xl mx-auto"
          )}>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
