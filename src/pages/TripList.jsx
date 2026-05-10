import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Map, Calendar, MoreVertical, Plus, Edit2, Trash2, CheckSquare, FileText, ArrowRight, DollarSign } from 'lucide-react';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`/trips/${id}`);
        setTrips(trips.filter(t => t.id !== id));
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
    setActiveMenu(null);
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Adventures</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and explore all your planned journeys.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by trip name..." 
              className="input-field pl-12 py-3 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/trips/create" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 text-sm">
            <Plus size={20} /> Plan Trip
          </Link>
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-96 animate-pulse border-white/20"></div>
          ))}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="glass-card border-white/20 overflow-hidden group hover:translate-y-[-8px] transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-teal-500/10">
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={trip.cover_image ? `http://localhost:5005${trip.cover_image}` : 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020'} 
                  alt={trip.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                
                {/* Menu Action */}
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === trip.id ? null : trip.id)}
                    className="bg-white/10 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white hover:text-slate-900 transition-all border border-white/20"
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {activeMenu === trip.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-20 animate-in zoom-in-95 duration-200">
                      <Link to={`/itinerary/${trip.id}`} className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors">
                        <Edit2 size={16} className="text-teal-500" /> Open Builder
                      </Link>
                      <Link to={`/itinerary/${trip.id}/packing`} className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors">
                        <CheckSquare size={16} className="text-sky-500" /> Packing List
                      </Link>
                      <Link to={`/itinerary/${trip.id}/notes`} className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors">
                        <FileText size={16} className="text-indigo-500" /> Journal Entries
                      </Link>
                      <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
                      <button onClick={() => handleDelete(trip.id)} className="flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full text-left font-black transition-colors">
                        <Trash2 size={16} /> Delete Trip
                      </button>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-black text-2xl mb-2 tracking-tight line-clamp-1">{trip.name}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-300">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-teal-400" /> {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Map size={14} className="text-teal-400" /> {trip.stop_count} Stops</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex gap-4 bg-white/40 dark:bg-slate-900/40 flex-1">
                <Link to={`/itinerary/${trip.id}`} className="btn-primary flex-1 text-center py-3 text-xs tracking-widest flex items-center justify-center gap-2">
                  Explore <ArrowRight size={14} />
                </Link>
                <Link to={`/itinerary/${trip.id}/budget`} className="btn-secondary flex-1 text-center py-3 text-xs tracking-widest flex items-center justify-center gap-2">
                   <DollarSign size={14} /> Budget
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-24 border-dashed border-2 border-slate-200 dark:border-slate-800 text-center">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Map size={48} className="text-slate-200 dark:text-slate-800" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No adventures found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-xs mx-auto">Your next big story starts with a single click. Let's plan it together!</p>
          <Link to="/trips/create" className="btn-primary inline-flex items-center gap-3 py-4 px-8">
            <Plus size={24} /> Create Your First Journey
          </Link>
        </div>
      )}
    </div>
  );
};

export default TripList;
