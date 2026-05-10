import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-24 bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800 rounded-2xl px-5 py-3 w-96 shadow-sm group focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
        <Search size={18} className="text-slate-400 group-focus-within:text-teal-500 transition-colors mr-3" />
        <input 
          type="text" 
          placeholder="Discover your next adventure..." 
          className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-8">
        <button className="relative text-slate-400 hover:text-teal-500 transition-all hover:scale-110 active:scale-95">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900">
            3
          </span>
        </button>

        <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 p-1.5 pr-5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-black text-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">{user?.name}</p>
            <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">{user?.role || 'Explorer'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
