import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      <div className="mesh-bg" />
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col relative z-10 w-full">
        <Navbar />
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
