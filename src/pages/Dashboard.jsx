import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Map, MapPin, Calendar, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get('/trips');
        // Simple logic for upcoming trips: filter trips where start_date is in the future
        const now = new Date();
        const upcoming = res.data.filter(trip => new Date(trip.start_date) > now);
        setUpcomingTrips(upcoming);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const recommendations = [
    { id: 1, name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?q=80&w=2071&auto=format&fit=crop' },
    { id: 3, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 h-80 flex items-center px-12 group shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl animate-in slide-in-from-left duration-700">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
            Explore your <span className="text-teal-400">Next Adventure</span>, {user?.name?.split(' ')?.[0] || 'Traveler'}!
          </h1>
          <p className="text-xl text-slate-300 font-medium mb-8 leading-relaxed">
            Personalized itineraries, smart budgets, and unforgettable memories await.
          </p>
          <Link to="/trips/create" className="btn-primary inline-flex items-center gap-3">
            <Plus size={24} />
            Start Planning
          </Link>
        </div>

        <div className="absolute right-12 bottom-12 animate-float hidden lg:block">
           <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-2xl">
              <Map className="text-teal-400 mb-2" size={32} />
              <p className="text-white font-black text-2xl">24</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">New Stops This Week</p>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column (Upcoming Trips & Stats) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Upcoming Trip */}
          <section>
            <div className="flex justify-between items-end mb-8 px-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Next Journey</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold">Pack your bags, adventure is calling!</p>
              </div>
              <Link to="/trips" className="text-teal-600 font-black flex items-center gap-2 hover:gap-3 transition-all uppercase text-xs tracking-widest">
                View All Trips <ArrowRight size={18} />
              </Link>
            </div>
            
            {loading ? (
              <div className="glass-card h-96 animate-pulse flex items-center justify-center text-slate-400">
                Crafting your adventure...
              </div>
            ) : upcomingTrips.length > 0 ? (
              <div className="glass-card overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-teal-500/10 transition-all">
                <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                  <img 
                    src={upcomingTrips[0].cover_image ? `http://localhost:5005${upcomingTrips[0].cover_image}` : 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020'} 
                    alt={upcomingTrips[0].name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-teal-500 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                    Confirmed
                  </div>
                </div>
                <div className="p-10 md:w-7/12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-teal-600 font-black text-xs uppercase tracking-widest mb-4">
                    <Map size={18} /> {upcomingTrips[0].stop_count} Stops In Total
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
                    {upcomingTrips[0].name}
                  </h3>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold mb-8">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Calendar size={18} className="text-teal-500" /> 
                      {new Date(upcomingTrips[0].start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link to={`/itinerary/${upcomingTrips[0].id}`} className="btn-primary flex-1 text-center text-sm py-4">Explore Plan</Link>
                    <Link to={`/itinerary/${upcomingTrips[0].id}/budget`} className="btn-secondary flex-1 text-center text-sm py-4">Financials</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-20 text-center border-dashed border-2 border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Map size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No upcoming adventures</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">The world is a book and those who do not travel read only one page.</p>
                <Link to="/trips/create" className="btn-primary inline-flex">Plan Your Journey</Link>
              </div>
            )}
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 gap-8">
            <div className="glass-card p-10 hover:shadow-indigo-500/10 transition-all">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl flex items-center justify-center text-indigo-500 shadow-sm mb-6">
                <Map size={32} />
              </div>
              <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">12</h3>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">Cities Visited</p>
            </div>
            <div className="glass-card p-10 hover:shadow-rose-500/10 transition-all">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/10 rounded-3xl flex items-center justify-center text-rose-500 shadow-sm mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">4</h3>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">Countries Explored</p>
            </div>
          </section>
        </div>

        {/* Right Column (Recommendations) */}
        <div className="space-y-8">
          <div className="px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Curated For You</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Destinations you might love.</p>
          </div>
          <div className="space-y-6">
            {recommendations.map(place => (
              <div key={place.id} className="group relative h-48 rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:-translate-y-2 transition-all duration-500">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                    <Star size={12} className="fill-amber-400" />
                  </div>
                  <h3 className="text-white font-black text-xl tracking-tight">{place.name}</h3>
                  <div className="h-0 group-hover:h-6 transition-all duration-300 opacity-0 group-hover:opacity-100 mt-2 overflow-hidden">
                    <span className="text-teal-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">Explore Deals <ArrowRight size={14} /></span>
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

export default Dashboard;
