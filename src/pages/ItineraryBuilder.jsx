import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, Plus, Trash2, ArrowRight, Activity, Navigation, DollarSign, CheckSquare, FileText, Share2 } from 'lucide-react';
import CitySearch from '../components/CitySearch';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    try {
      const [tripRes, stopsRes, activitiesRes] = await Promise.all([
        axios.get(`/trips/${id}`),
        axios.get(`/trips/${id}/stops`),
        axios.get(`/trips/${id}/activities`)
      ]);
      setTrip(tripRes.data);
      setStops(stopsRes.data);
      setActivities(activitiesRes.data);
      
      // Auto-select first stop if none selected
      if (stopsRes.data.length > 0 && !selectedStop) {
        setSelectedStop(stopsRes.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async (cityData) => {
    try {
      await axios.post(`/trips/${id}/stops`, {
        city_name: cityData.city,
        country: cityData.country,
        start_date: trip.start_date, // Default to trip start date initially
        end_date: trip.end_date
      });
      setShowAddStop(false);
      fetchTripData();
    } catch (err) {
      console.error('Failed to add stop', err);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (window.confirm("Delete this stop and all its activities?")) {
      try {
        await axios.delete(`/trips/${id}/stops/${stopId}`);
        if (selectedStop?.id === stopId) setSelectedStop(null);
        fetchTripData();
      } catch (err) {
        console.error('Failed to delete stop', err);
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Remove this activity from the itinerary?")) {
      try {
        await axios.delete(`/trips/${id}/activities/${activityId}`);
        fetchTripData();
      } catch (err) {
        console.error('Failed to delete activity', err);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading itinerary...</div>;
  if (!trip) return <div className="p-8 text-center text-red-500 font-bold">Trip not found</div>;

  const currentActivities = selectedStop 
    ? activities.filter(a => a.stop_id === selectedStop.id) 
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8 border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{trip.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-2 font-bold uppercase text-xs tracking-widest">
            <Calendar size={16} className="text-teal-500" /> 
            {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/itinerary/${id}/budget`} className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border border-teal-100/50 dark:border-teal-900/30">
            <DollarSign size={16} /> Budget
          </Link>
          <Link to={`/itinerary/${id}/packing`} className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border border-sky-100/50 dark:border-sky-900/30">
            <CheckSquare size={16} /> Packing
          </Link>
          <Link to={`/itinerary/${id}/notes`} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border border-indigo-100/50 dark:border-indigo-900/30">
            <FileText size={16} /> Notes
          </Link>
          <Link to={`/public/${id}`} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
            <Share2 size={16} /> Share
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stops Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Navigation size={22} className="text-teal-500" /> Route
            </h2>
            <button 
              onClick={() => setShowAddStop(!showAddStop)}
              className="text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 p-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus size={24} />
            </button>
          </div>

          {showAddStop && (
            <div className="glass-card p-6 border-white/20 animate-in slide-in-from-top-4 duration-300">
              <CitySearch onCitySelect={handleAddStop} />
              <button 
                onClick={() => setShowAddStop(false)}
                className="mt-4 text-xs font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 block w-full text-center uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="glass-card border-white/20 overflow-hidden">
            {stops.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <MapPin size={40} className="text-slate-300 dark:text-slate-700" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-6">No stops added yet.</p>
                <button 
                  onClick={() => setShowAddStop(true)}
                  className="btn-primary py-3 px-6 text-sm"
                >
                  Add Destination
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-white/10 dark:divide-slate-800">
                {stops.map((stop, index) => (
                  <li key={stop.id} className="relative">
                    {/* Connecting line */}
                    {index !== stops.length - 1 && (
                      <div className="absolute left-[2.25rem] top-14 bottom-[-1rem] w-0.5 bg-teal-100 dark:bg-teal-900/30 z-0"></div>
                    )}
                    
                    <div 
                      className={`relative z-10 flex items-start gap-4 p-6 cursor-pointer transition-all duration-300 ${
                        selectedStop?.id === stop.id ? 'bg-teal-500/10 dark:bg-teal-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                      }`}
                      onClick={() => setSelectedStop(stop)}
                    >
                      <div className={`mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                        selectedStop?.id === stop.id ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-black text-xl tracking-tight ${selectedStop?.id === stop.id ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {stop.city_name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{stop.country}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id); }}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ opacity: selectedStop?.id === stop.id ? 1 : undefined }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Activities for Selected Stop */}
        <div className="lg:col-span-2">
          {selectedStop ? (
            <div className="glass-card p-8 border-white/20 min-h-[600px] flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-white/10 dark:border-slate-800 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore {selectedStop.city_name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Plan your activities for this destination.</p>
                </div>
                <Link 
                  to={`/itinerary/${id}/activities/${selectedStop.id}?city=${encodeURIComponent(selectedStop.city_name)}`}
                  className="btn-primary py-3 px-6 flex items-center gap-2 text-sm"
                >
                  <Activity size={20} /> Find Activities
                </Link>
              </div>

              {currentActivities.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                    <Activity size={48} className="text-slate-200 dark:text-slate-700" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-800 dark:text-white mb-1 tracking-tight">Your itinerary for {selectedStop.city_name} is empty.</p>
                    <Link 
                      to={`/itinerary/${id}/activities/${selectedStop.id}?city=${encodeURIComponent(selectedStop.city_name)}`}
                      className="text-teal-600 dark:text-teal-400 font-black hover:underline uppercase text-xs tracking-widest"
                    >
                      Browse recommended activities
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {currentActivities.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 hover:translate-y-[-4px] transition-all duration-500 group shadow-sm">
                      <div className="w-full sm:w-48 h-32 relative overflow-hidden rounded-2xl shadow-md">
                        <img 
                          src={activity.image_url || 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a'} 
                          alt={activity.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 shadow-lg">
                          ${activity.cost}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 transition-colors">{activity.title}</h3>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{activity.type}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="mt-auto flex items-center gap-4">
                          {activity.duration_minutes && (
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold bg-slate-100/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl">
                              <Clock size={14} className="text-teal-500" /> {activity.duration_minutes} min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card border-dashed border-2 border-slate-200 dark:border-slate-800 h-[600px] flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                <MapPin size={48} className="text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Timeline Selection</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">Select a destination from your route timeline to customize your adventure.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ItineraryBuilder;
