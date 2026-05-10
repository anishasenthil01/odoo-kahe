import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Plus } from 'lucide-react';

const CitySearch = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        searchCities(query);
      } else {
        fetchPopularCities();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchPopularCities = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/destinations/search');
      setResults(res.data.slice(0, 5)); // Show top 5
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await axios.get(`/destinations/search?q=${searchQuery}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in slide-in-from-top-4">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative group">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Where are we going?" 
          className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold dark:text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-slate-900">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Searching Destinations...</div>
        ) : results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((city) => (
              <li key={city.id}>
                <button 
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                  onClick={() => onCitySelect(city)}
                >
                  <div className="flex items-center gap-5">
                    <img src={city.image} alt={city.city} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div>
                      <p className="font-black text-slate-800 dark:text-white text-lg tracking-tight leading-tight">{city.city}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                        <MapPin size={14} className="text-teal-500" /> {city.country}
                      </p>
                    </div>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                    <Plus size={20} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-slate-400 font-black uppercase text-xs tracking-widest">
            No destinations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;
