import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Wallet, 
  CheckSquare, 
  Settings, 
  LogOut,
  MapPin,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'My Trips', path: '/trips', icon: <Map size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: <Shield size={20} /> });
  }

  return (
    <div className="w-64 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/40 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-4 border-b border-white/20 dark:border-slate-800">
        <div className="bg-teal-500 p-2.5 rounded-2xl shadow-lg shadow-teal-500/30 rotate-3 group-hover:rotate-0 transition-transform">
          <MapPin size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Traveloop</h1>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 translate-x-2' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-white hover:translate-x-1'
              }`
            }
          >
            <div className="transition-transform group-hover:scale-110">
              {item.icon}
            </div>
            <span className="font-bold tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-white/20 dark:border-slate-800">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold group"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <LogOut size={20} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
