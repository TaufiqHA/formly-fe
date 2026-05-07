import React, { useState } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import TopBar from './components/TopBar';
import { cn } from './lib/utils';
import Dashboard from './views/Dashboard';
import OrderQueue from './views/OrderQueue';
import OrderDetails from './views/OrderDetails';
import FormBuilder from './views/FormBuilder';
import FormList from './views/FormList';
import CustomerBase from './views/CustomerBase';
import PublicForm from './views/PublicForm';
import Settings from './views/Settings';
import Profile from './views/Profile';
import WhatsAppSettings from './views/WhatsAppSettings';
import Login from './views/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Dashboard />;
      case 'orders':
        return <OrderQueue onSelectOrder={() => setCurrentView('orderDetails')} />;
      case 'orderDetails':
        return <OrderDetails onBack={() => setCurrentView('orders')} />;
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
      case 'customers':
        return <CustomerBase />;
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
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView('overview');
        }}
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
