import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Map, Activity, TrendingUp, Search, 
  Trash2, Shield, ShieldAlert, MoreHorizontal,
  BarChart as BarChartIcon, LayoutDashboard, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await axios.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-black text-slate-300">ADMIN PANEL LOADING...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-screen pb-20">
      {/* Admin Sidebar */}
      <div className="w-full lg:w-72 space-y-4">
        <div className="bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 sticky top-6 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <span className="font-black text-xl tracking-tight">Admin Center</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-teal-500 shadow-lg shadow-teal-500/20' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <LayoutDashboard size={20} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-teal-500 shadow-lg shadow-teal-500/20' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <Users size={20} /> User Management
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-teal-500 shadow-lg shadow-teal-500/20' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <Settings size={20} /> App Settings
            </button>
          </nav>

          <div className="pt-10">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Logged in as</p>
              <p className="font-black truncate">Super Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 border-white/20">
                <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                  <Users size={28} />
                </div>
                <h4 className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest mb-1">Total Users</h4>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stats?.stats?.total_users}</p>
              </div>
              <div className="glass-card p-8 border-white/20">
                <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                  <Map size={28} />
                </div>
                <h4 className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest mb-1">Total Trips</h4>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stats?.stats?.total_trips}</p>
              </div>
              <div className="glass-card p-8 border-white/20">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <Activity size={28} />
                </div>
                <h4 className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest mb-1">Activities</h4>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stats?.stats?.total_activities}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8 border-white/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2">
                  <TrendingUp size={20} className="text-teal-500" /> User Growth (6M)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.user_growth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '20px', 
                          border: 'none', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={4} dot={{ r: 6, fill: '#14b8a6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-8 border-white/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2">
                  <BarChartIcon size={20} className="text-sky-500" /> Top Destinations
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.top_destinations}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                      <XAxis dataKey="city_name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                      <Tooltip 
                        cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                        contentStyle={{ 
                          borderRadius: '20px', 
                          border: 'none', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar dataKey="count" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden border-white/20">
            <div className="p-8 border-b border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h3>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="input-field pl-12 py-3 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">User</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Role</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Joined</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 dark:divide-slate-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center font-black shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleRole(user)}
                            className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"
                            title="Toggle Admin Role"
                          >
                            <ShieldAlert size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center">
                <Users size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-800" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No users found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-12 border-white/20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Settings size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">System Configuration</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-4 font-medium leading-relaxed">Global application settings and environment variables management interface coming soon. This area will allow granular control over API limits and auth providers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
