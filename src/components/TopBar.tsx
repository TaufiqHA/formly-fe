import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, FileText, CheckCircle2, Menu, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from './Sidebar';
import { cn } from '../lib/utils';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/notification';

interface TopBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onMenuClick: () => void;
  onSelectSubmission?: (id: string) => void;
  user?: any;
}

export default function TopBar({ currentView, onViewChange, onMenuClick, onSelectSubmission, user }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data.items);
        setUnreadCount(res.data.unread_count);
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling setiap 60 detik
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Gagal tandai semua dibaca", error);
    }
  };

  const handleNotifClick = async (notif: Notification) => {
    // Navigasi ke submission
    if (onSelectSubmission && notif.data.submission_id) {
      onSelectSubmission(notif.data.submission_id);
    }
    
    setShowNotifications(false);

    // Tandai dibaca jika belum
    if (!notif.read_at) {
      try {
        await notificationService.markAsRead(notif.id);
        // Optimistic update
        setNotifications(notifications.map(n => 
          n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Gagal tandai dibaca", error);
      }
    }
  };

  return (
    <header className="flex justify-between items-center h-20 px-6 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container rounded-lg md:hidden transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        
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
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center bg-error text-white text-[10px] font-bold rounded-full border border-surface-container-lowest transform translate-x-1/4 -translate-y-1/4">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/50">
                    <h3 className="font-bold text-sm">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-xs text-on-surface-variant">Tidak ada notifikasi baru</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <button 
                          key={n.id} 
                          onClick={() => handleNotifClick(n)}
                          className={cn(
                            "w-full text-left p-4 hover:bg-surface-container transition-colors border-b border-outline-variant/30 last:border-0 group relative",
                            !n.read_at && "bg-primary/5"
                          )}
                        >
                          {!n.read_at && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
                          )}
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-white transition-colors shrink-0",
                              !n.read_at ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"
                            )}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className={cn("text-sm leading-tight", !n.read_at ? "font-bold text-on-surface" : "text-on-surface-variant")}>
                                Ada submission baru: {n.data.form_title}
                              </p>
                              <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                                Dari: {n.data.customer_name}
                              </p>
                              <p className="text-[10px] text-on-surface-variant mt-1">
                                {new Date(n.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      onViewChange('orders');
                      setShowNotifications(false);
                    }}
                    className="w-full py-3 bg-surface-container-low text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors text-center uppercase tracking-widest"
                  >
                    Lihat Semua Pesanan
                  </button>
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
          src={user?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || 'Admin') + "&background=random"}
          alt="User Profile"
          className={cn(
            "w-9 h-9 rounded-full border border-outline-variant object-cover cursor-pointer hover:opacity-80 transition-all shrink-0",
            currentView === 'profile' && "ring-2 ring-primary ring-offset-2 border-primary"
          )}
        />
      </div>
    </header>
  );
}
