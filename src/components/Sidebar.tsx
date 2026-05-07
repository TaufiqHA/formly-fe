import React from 'react';
import { LayoutDashboard, ClipboardList, Layers, Package, Users, HelpCircle, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'overview' | 'orders' | 'orderDetails' | 'formList' | 'builder' | 'customers' | 'publicForm' | 'settings' | 'profile' | 'whatsapp';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Queue', icon: ClipboardList },
    { id: 'formList', label: 'Form Builder', icon: Layers },
    { id: 'whatsapp', label: 'WhatsApp API', icon: MessageSquare },
    { id: 'customers', label: 'Customer Base', icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant h-screen sticky top-0 py-6">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            O
          </div>
          <div>
            <h2 className="font-semibold text-on-surface text-lg leading-tight">Orderly</h2>
            <p className="text-xs text-on-surface-variant leading-none mt-1">Enterprise Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
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

      <div className="px-6 mt-auto space-y-4">
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
  );
}
