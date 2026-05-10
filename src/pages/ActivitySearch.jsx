import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Clock, DollarSign, Star, Plus, ArrowLeft, Filter, X } from 'lucide-react';
import Modal from '../components/Modal';

const ActivitySearch = () => {
  const { id: tripId, stopId } = useParams();
  const [searchParams] = useSearchParams();
  const cityName = searchParams.get('city') || '';
  
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    maxCost: '',
    minRating: '',
    maxDuration: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [cityName, filters]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: query || cityName,
        ...filters
      });
      const res = await axios.get(`/destinations/activities?${params.toString()}`);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchActivities();
  };

  const handleAddActivity = async (activity) => {
    setAddingId(activity.id);
    try {
      await axios.post(`/trips/${tripId}/activities`, {
        stop_id: stopId,
        title: activity.title,
        description: activity.description || activity.type,
        type: activity.type,
        cost: activity.cost,
        currency: 'USD',
        duration_minutes: activity.duration_minutes,
        rating: activity.rating,
        image_url: activity.image_url
      });
      
      navigate(`/itinerary/${tripId}`);
    } catch (err) {
      console.error('Failed to add activity', err);
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-[3rem] relative overflow-hidden h-96 flex items-center justify-center shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974')] bg-cover bg-center opacity-40 scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl">
          <button 
            onClick={() => navigate(-1)}
            className="absolute -top-24 left-0 text-white flex items-center gap-2 hover:text-teal-400 transition-all font-black text-xs uppercase tracking-widest bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <h1 className="text-6xl font-black text-white mb-8 tracking-tighter leading-none">
            Explore {cityName || 'the World'}
          </h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="What would you like to do?" 
              className="w-full pl-16 pr-6 py-6 rounded-3xl shadow-2xl focus:outline-none focus:ring-8 focus:ring-teal-500/20 text-xl border-0 bg-white/95 backdrop-blur-md font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="glass-card p-8 border-white/20 sticky top-6">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-8 text-xl tracking-tight">
              <Filter size={22} className="text-teal-500" />
              Filters
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">Category</label>
                <select 
                  name="type" 
                  className="input-field text-sm font-bold"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="" className="dark:bg-slate-900">All Categories</option>
                  <option value="Sightseeing" className="dark:bg-slate-900">Sightseeing</option>
                  <option value="Museum" className="dark:bg-slate-900">Museum</option>
                  <option value="Cultural" className="dark:bg-slate-900">Cultural</option>
                  <option value="Nature" className="dark:bg-slate-900">Nature</option>
                  <option value="Dining" className="dark:bg-slate-900">Dining</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">Max Price ($)</label>
                <input 
                  type="number" 
                  name="maxCost"
                  className="input-field text-sm font-bold"
                  placeholder="e.g. 100"
                  value={filters.maxCost}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">Min Rating</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      className={`py-3 rounded-2xl text-xs font-black border transition-all ${filters.minRating == rating ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-teal-300'}`}
                      onClick={() => setFilters(f => ({ ...f, minRating: f.minRating == rating ? '' : rating }))}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setFilters({ type: '', maxCost: '', minRating: '', maxDuration: '' })}
                className="w-full py-2 text-xs font-black text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors uppercase tracking-[0.2em]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {activities.length} {activities.length === 1 ? 'Experience' : 'Experiences'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card h-[450px] animate-pulse border-white/20"></div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="glass-card border-white/20 overflow-hidden group hover:translate-y-[-8px] transition-all duration-500 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-teal-500/10"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={activity.image_url} 
                      alt={activity.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1 text-slate-900 dark:text-white shadow-xl">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> {activity.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-teal-500/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-white shadow-xl uppercase tracking-widest">
                      {activity.type}
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors tracking-tight">
                      {activity.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8 font-bold">
                      <MapPin size={16} className="text-teal-500" /> {activity.city}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Cost</span>
                          <span className="font-black text-slate-900 dark:text-white text-xl flex items-center">
                            <DollarSign size={20} className="text-teal-500" /> {activity.cost}
                          </span>
                        </div>
                        <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
                          <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Time</span>
                          <span className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Clock size={16} className="text-teal-500" /> {activity.duration_minutes}m
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddActivity(activity);
                        }}
                        disabled={addingId === activity.id}
                        className="bg-teal-500 text-white hover:bg-teal-600 h-14 w-14 rounded-[1.5rem] transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center disabled:opacity-50 active:scale-95"
                      >
                        {addingId === activity.id ? (
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : <Plus size={28} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-24 border-dashed border-2 border-slate-200 dark:border-slate-800 text-center">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search size={40} className="text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No results matching filters</h3>
              <p className="max-w-xs mx-auto text-slate-500 dark:text-slate-400 font-medium">Try broadening your search or resetting the filters above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Modal 
        isOpen={!!selectedActivity} 
        onClose={() => setSelectedActivity(null)}
        title="Experience Details"
      >
        {selectedActivity && (
          <div className="space-y-8">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img src={selectedActivity.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black flex items-center gap-2 text-slate-900 dark:text-white shadow-2xl">
                <Star size={18} className="text-amber-400 fill-amber-400" /> {selectedActivity.rating}
              </div>
            </div>
            
            <div className="px-2">
              <div className="flex justify-between items-start gap-6 mb-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{selectedActivity.title}</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-8 font-black uppercase text-xs tracking-widest">
                <MapPin size={18} className="text-teal-500" /> {selectedActivity.city} &bull; {selectedActivity.type}
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] space-y-6 border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  Immerse yourself in the authentic atmosphere of {selectedActivity.city} with this curated {selectedActivity.type.toLowerCase()} experience. 
                  Hand-picked for travelers seeking high-quality, unforgettable moments.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-3xl border border-white dark:border-white/5 shadow-sm">
                    <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-teal-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-black text-slate-900 dark:text-white text-lg">{selectedActivity.duration_minutes}m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-3xl border border-white dark:border-white/5 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Cost</p>
                      <p className="font-black text-slate-900 dark:text-white text-lg">${selectedActivity.cost}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleAddActivity(selectedActivity)}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Plus size={24} /> Add to Itinerary
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivitySearch;
