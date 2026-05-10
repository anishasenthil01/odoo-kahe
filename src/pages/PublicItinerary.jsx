import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, MapPin, Share2, Copy, ArrowRight, 
  ChevronRight, Clock, Info, ExternalLink 
} from 'lucide-react';

const PublicItinerary = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicTrip = async () => {
      try {
        // Use the public endpoint (doesn't require token)
        const res = await axios.get(`/trips/${tripId}/public`);
        setTrip(res.data);
      } catch (err) {
        console.error('Failed to fetch trip', err);
        setError('This trip is private or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTrip();
  }, [tripId]);

  const handleCopyTrip = async () => {
    // Logic to copy trip for logged-in user
    try {
      const res = await axios.post(`/trips/${tripId}/copy`);
      navigate(`/itinerary/${res.data.id}`);
    } catch (err) {
      alert('Please log in to copy this trip!');
      navigate('/login');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Traveloop Itinerary: ${trip.name}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading amazing journey...</div>;
  if (error) return (
    <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
        <Info size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
      <p className="text-slate-500 mb-8">{error}</p>
      <button onClick={() => navigate('/')} className="btn-primary w-full">Go to Homepage</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
      {/* Hero Section */}
      <div className="relative h-[450px] md:h-[550px] rounded-[3.5rem] overflow-hidden shadow-2xl">
        <img 
          src={trip.cover_image ? `http://localhost:5005${trip.cover_image}` : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'} 
          className="w-full h-full object-cover" 
          alt={trip.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit shadow-xl shadow-teal-500/20">
              Shared Journey
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-100 font-black uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2.5">
                <Calendar size={18} className="text-teal-400" /> 
                {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2.5">
                <MapPin size={18} className="text-teal-400" /> 
                {trip.stops?.length || 0} Destinations
              </span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleCopyTrip}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-teal-500 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              <Copy size={20} /> Copy Trip
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all active:scale-95"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-10 border-white/20">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">About this Trip</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium text-lg">
              {trip.description || "No description provided for this amazing journey."}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Created By</span>
                <span className="font-black text-slate-800 dark:text-slate-200">User #{trip.user_id}</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</span>
                <span className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400 font-black uppercase text-xs">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                  Public
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <h3 className="text-2xl font-black mb-4 tracking-tight relative z-10">Want to plan your own?</h3>
            <p className="text-slate-400 dark:text-slate-500 mb-10 text-sm leading-relaxed font-bold relative z-10">
              Traveloop is the AI-powered travel planner that helps you discover hidden gems and build perfect itineraries in seconds.
            </p>
            <button className="w-full bg-teal-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-teal-400 transition-all relative z-10 shadow-xl shadow-teal-500/20">
              Join Traveloop <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-2 space-y-12">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-6 tracking-tight">
            Journey Timeline
            <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
          </h2>

          <div className="space-y-16 relative">
            {/* Vertical Line */}
            <div className="absolute left-7 top-4 bottom-4 w-1.5 bg-gradient-to-b from-teal-500/30 via-teal-500 to-teal-500/30 rounded-full shadow-inner shadow-teal-500/20"></div>

            {trip.stops?.map((stop, index) => (
              <div key={stop.id} className="relative pl-20 group">
                {/* Timeline Node */}
                <div className="absolute left-3 top-2 w-10 h-10 bg-white dark:bg-slate-900 border-4 border-teal-500 rounded-[1.25rem] z-10 shadow-xl shadow-teal-500/20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"></div>
                
                <div className="glass-card p-10 border-white/20 group-hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div>
                      <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] block mb-2">
                        Stop #{index + 1}
                      </span>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stop.city_name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 mt-2 uppercase text-xs tracking-widest">
                        <Calendar size={16} className="text-teal-500" /> 
                        {new Date(stop.start_date).toLocaleDateString()} — {new Date(stop.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/50 px-5 py-3 rounded-2xl text-slate-700 dark:text-slate-300 font-black text-sm border border-white/20">
                      <Clock size={18} className="text-teal-500" /> {Math.ceil((new Date(stop.end_date) - new Date(stop.start_date)) / (1000 * 60 * 60 * 24))} Days
                    </div>
                  </div>

                  {/* Activities for this stop */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                      Planned Activities
                    </h4>
                    {stop.activities?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stop.activities.map(activity => (
                          <div key={activity.id} className="flex items-center gap-5 p-5 bg-white/40 dark:bg-slate-800/40 rounded-3xl border border-white/40 dark:border-slate-700/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default group/item shadow-sm">
                            <img src={activity.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover/item:scale-110 transition-transform" alt="" />
                            <div>
                              <p className="font-black text-slate-800 dark:text-white text-lg leading-tight line-clamp-1">{activity.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">{activity.type} &bull; {activity.duration_minutes}m</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-600 italic text-sm font-medium">No specific activities listed for this stop.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicItinerary;
