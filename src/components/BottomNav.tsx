import React from 'react';
import { useKhata } from '../context/KhataContext';
import { ScreenId } from '../types';
import { BookOpen, PlusCircle, Bell, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, overdueCount, setSelectedCustomerId, t } = useKhata();

  const handleNav = (screen: ScreenId) => {
    if (screen !== 'customer') {
      setSelectedCustomerId(null);
    }
    setCurrentScreen(screen);
    document.getElementById('app-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: t.navKhata,
      icon: <BookOpen className="w-5 h-5 mb-0.5" />,
    },
    {
      id: 'add',
      label: t.navNewBill,
      icon: <PlusCircle className="w-6 h-6 mb-0.5 text-emerald-600 group-hover:scale-110 transition-transform" />,
    },
    {
      id: 'reminders',
      label: t.navReminders,
      icon: <Bell className="w-5 h-5 mb-0.5" />,
      badge: overdueCount,
    },
    {
      id: 'reports',
      label: t.navReports,
      icon: <BarChart3 className="w-5 h-5 mb-0.5" />,
    },
  ];

  return (
    <nav className="shrink-0 sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] mt-auto">
      <div className="mx-auto grid w-full max-w-md grid-cols-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`group relative flex min-h-12 flex-col items-center justify-center px-1 py-1 rounded-xl transition active:scale-95 ${
                isActive ? 'text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0 right-4 min-w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full px-1 flex items-center justify-center ring-2 ring-white animate-bounce">
                  {item.badge}
                </span>
              ) : null}

              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-center text-[11px] leading-tight mt-0.5 ${isActive ? 'text-indigo-800 font-bold' : 'text-slate-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
