import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, MapPin, Calendar, AlignLeft, Globe } from 'lucide-react';
import axios from 'axios';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_public: false,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('start_date', formData.start_date);
      data.append('end_date', formData.end_date);
      data.append('is_public', formData.is_public ? '1' : '0');
      
      if (imageFile) {
        data.append('cover_image', imageFile);
      }

      const res = await axios.post('/trips', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to the newly created trip's itinerary builder
      navigate(`/itinerary/${res.data.tripId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Plan a New Adventure</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Fill in the basic details to start building your itinerary.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-6 rounded-3xl border border-red-500/20 font-black flex items-center gap-4 animate-in slide-in-from-top-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-10 border-white/20">
        
        {/* Image Upload Area */}
        <div>
          <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Cover Image</label>
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] h-72 flex flex-col items-center justify-center overflow-hidden group hover:border-teal-500/50 transition-all bg-slate-50/50 dark:bg-slate-950/50">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-black flex items-center gap-3 text-lg">
                    <ImagePlus size={28} /> Change Image
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 flex flex-col items-center p-8">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <ImagePlus size={40} className="text-slate-300 dark:text-slate-700 group-hover:text-teal-500 transition-colors" />
                </div>
                <p className="font-black text-slate-800 dark:text-white text-xl tracking-tight">Upload a cover photo</p>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Trip Name */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={16} className="text-teal-500" /> Trip Name
            </label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="e.g., Summer Backpacking in Europe" 
              className="input-field text-xl font-black py-5 px-8"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={16} className="text-teal-500" /> Start Date
            </label>
            <input 
              type="date" 
              name="start_date"
              required
              className="input-field py-4 px-6 font-bold"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={16} className="text-teal-500" /> End Date
            </label>
            <input 
              type="date" 
              name="end_date"
              required
              className="input-field py-4 px-6 font-bold"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <AlignLeft size={16} className="text-teal-500" /> Description (Optional)
            </label>
            <textarea 
              name="description"
              rows="4" 
              placeholder="What's the goal of this trip? Any special themes?"
              className="input-field py-5 px-8 resize-none font-bold text-lg leading-relaxed h-48"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Privacy Toggle */}
          <div className="md:col-span-2 flex items-center gap-6 p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 bg-teal-500/10 dark:bg-teal-500/5 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Globe size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800 dark:text-white tracking-tight text-lg">Public Itinerary</h4>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Allow others to view this journey (read-only).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_public"
                className="sr-only peer" 
                checked={formData.is_public}
                onChange={handleChange}
              />
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary py-4 px-10 text-sm tracking-widest uppercase">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary py-4 px-12 text-sm tracking-widest uppercase flex items-center justify-center gap-3 min-w-[240px]">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Launch My Trip'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateTrip;
