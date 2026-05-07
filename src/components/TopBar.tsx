import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from './Sidebar';
import { cn } from '../lib/utils';

interface TopBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function TopBar({ currentView, onViewChange }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Pesanan Baru', text: 'Pesanan #ORD-123 baru saja masuk', time: '2 menit yang lalu', icon: FileText, color: 'text-primary' },
    { id: 2, title: 'Pembayaran Diterima', text: 'Pembayaran #ORD-120 telah dikonfirmasi', time: '15 menit yang lalu', icon: CheckCircle2, color: 'text-success-text' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center h-16 px-6 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-12">
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-full transition-colors relative",
                showNotifications ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface-container-lowest" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                    <h3 className="font-bold text-sm">Notifikasi</h3>
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Tandai Dibaca</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <button key={n.id} className="w-full text-left p-4 hover:bg-surface-container transition-colors border-b border-outline-variant/30 last:border-0 group">
                        <div className="flex gap-3">
                          <div className={cn("w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-full group-hover:bg-white transition-colors shrink-0", n.color)}>
                            <n.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">{n.title}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{n.text}</p>
                            <p className="text-[10px] text-on-surface-variant mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-surface-container-low text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors text-center uppercase tracking-widest">Lihat Semua</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => onViewChange('settings')}
            className={cn(
              "p-2 rounded-full transition-colors",
              currentView === 'settings' ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container"
            )}
          >
            <Settings size={20} />
          </button>
        </div>

        <img
          onClick={() => onViewChange('profile')}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAusETVBoa3v1yNS7G3II5xdsLACSYMw3VKgQayx2V1ZyXaxeBtDl6fvhZ7nkjvbgpwW9Sb2m1urp-SF_BNNov-s1QPoIhiN3M_z9VSFoBuZyTm6GYp4ioDe1RTc5f7sQjQn1VjVFO3lOLpKvEeyPFovk-wuN6lGCKi5UI98D3XenoA5hLL7dILS7PCDppItpL9IlXkpIPPXA065CyjFdKCNH2pE5_ylcGqLKY-OFkiel_1pbkyFE3vk6wtdgxmRpO1tytFA0u3onSd"
          alt="User Profile"
          className={cn(
            "w-9 h-9 rounded-full border border-outline-variant object-cover cursor-pointer hover:opacity-80 transition-all",
            currentView === 'profile' && "ring-2 ring-primary ring-offset-2 border-primary"
          )}
        />
      </div>
    </header>
  );
}
