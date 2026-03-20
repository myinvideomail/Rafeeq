import { NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Activity, BookOpen, HeartPulse, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navigation() {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: MessageCircle, label: 'رفيق' },
    { to: '/mood', icon: Activity, label: 'مزاجي' },
    { to: '/exercises', icon: HeartPulse, label: 'تمارين' },
    { to: '/library', icon: BookOpen, label: 'مكتبة' },
    { to: '/subscription', icon: Star, label: 'بريميوم' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-emerald-500 rounded-b-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
