import React from 'react';
import { LayoutDashboard, ClipboardList, Layers, Package, Users, HelpCircle, LogOut, MessageSquare, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'overview' | 'orders' | 'orderDetails' | 'formList' | 'builder' | 'publicForm' | 'settings' | 'profile' | 'whatsapp';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentView, onViewChange, onLogout, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'orders', label: 'Data Masuk', icon: ClipboardList },
    { id: 'formList', label: 'Manajemen Form', icon: Layers },
    { id: 'whatsapp', label: 'WhatsApp API', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-lowest border-r border-outline-variant flex flex-col transition-transform duration-300 md:relative md:translate-x-0 md:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 px-6 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <div>
              <h2 className="font-semibold text-on-surface text-lg leading-tight">Formly</h2>
              <p className="text-xs text-on-surface-variant leading-none mt-1">Enterprise Admin</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg md:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id as ViewType);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                (currentView === item.id || (item.id === 'formList' && currentView === 'builder'))
                  ? "bg-secondary-container text-primary shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto pb-8 space-y-4">
          <div className="border-t border-outline-variant pt-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
              <HelpCircle size={20} />
              Help Center
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
