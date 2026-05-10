import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { User, Lock, Globe, Moon, Trash2, MapPin, Camera, Save, LogOut, Info, X } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    language_preference: user?.language_preference || 'en',
    theme_preference: user?.theme_preference || 'light'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_image || '');

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Saved Destinations State
  const [savedDestinations, setSavedDestinations] = useState([]);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedDestinations();
    }
  }, [activeTab]);

  const fetchSavedDestinations = async () => {
    try {
      const res = await axios.get('/auth/saved');
      setSavedDestinations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('language_preference', profileData.language_preference);
      formData.append('theme_preference', profileData.theme_preference);
      if (profileImage) formData.append('profile_image', profileImage);

      await axios.put('/auth/profile', formData);
      setTheme(profileData.theme_preference);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      await axios.post('/auth/change-password', securityData);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This will delete all your trips and data.')) {
      try {
        await axios.delete('/auth/account');
        logout();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUnsave = async (id) => {
    try {
      await axios.delete(`/auth/saved/${id}`);
      setSavedDestinations(savedDestinations.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Personalize your Traveloop experience.</p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${feedback.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <Info size={20} />
          <span className="font-bold">{feedback.message}</span>
          <button onClick={() => setFeedback({ message: '' })} className="ml-auto p-1 hover:bg-black/5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="glass-card flex flex-col md:flex-row overflow-hidden min-h-[600px] border-white/20">
        {/* Sidebar Nav */}
        <div className="w-full md:w-80 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 p-8 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-left ${activeTab === 'profile' ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'}`}
          >
            <User size={20} /> Edit Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-left ${activeTab === 'security' ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'}`}
          >
            <Lock size={20} /> Security
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-left ${activeTab === 'saved' ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'}`}
          >
            <Save size={20} /> Saved Destinations
          </button>
          <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[700px] custom-scrollbar">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black text-4xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:scale-110 transition-transform">
                    <Camera size={20} className="text-teal-500" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProfileImage(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Information</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Update your name and account preferences.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</label>
                  <select 
                    className="input-field"
                    value={profileData.language_preference}
                    onChange={(e) => setProfileData({...profileData, language_preference: e.target.value})}
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Interface Theme</label>
                <div className="flex gap-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setProfileData({...profileData, theme_preference: 'light'});
                      setTheme('light');
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] font-bold transition-all border-2 ${profileData.theme_preference === 'light' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500 text-teal-700 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Globe size={20} /> Light Mode
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setProfileData({...profileData, theme_preference: 'dark'});
                      setTheme('dark');
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] font-bold transition-all border-2 ${profileData.theme_preference === 'dark' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500 text-teal-700 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Moon size={20} /> Dark Mode
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Security</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your password and account status.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password" 
                    className="input-field"
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    className="input-field"
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="input-field"
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>

              <div className="pt-12 mt-12 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2.5rem] border border-red-100 dark:border-red-900/20">
                  <h3 className="text-red-700 dark:text-red-400 font-black mb-2 flex items-center gap-2">
                    <Trash2 size={20} /> Danger Zone
                  </h3>
                  <p className="text-red-600/70 dark:text-red-400/60 text-sm font-medium mb-6 leading-relaxed">
                    Once you delete your account, all your data, trips, and settings will be permanently removed. This action cannot be undone.
                  </p>
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-black text-sm hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all shadow-md"
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Saved Destinations</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Destinations you're dreaming of visiting.</p>
              </div>

              {savedDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedDestinations.map(dest => (
                    <div key={dest.id} className="relative group overflow-hidden rounded-[2.5rem] h-52 shadow-lg">
                      <img src={dest.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 flex flex-col">
                        <span className="text-white text-2xl font-black">{dest.city_name}</span>
                        <span className="text-teal-300 font-bold flex items-center gap-1">
                          <MapPin size={14} /> {dest.country}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleUnsave(dest.id)}
                        className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-red-500 transition-all border border-white/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-20 rounded-[3rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
                  <Save size={48} className="mx-auto mb-6 text-slate-200 dark:text-slate-700" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No saved destinations</h3>
                  <p className="text-slate-500 dark:text-slate-500 mt-2">Explore destinations and save them to see them here!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
