import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, Circle, Plus, Trash2, RotateCcw, 
  Shirt, Laptop, FileText, Pill, Package, Search
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Clothing', icon: <Shirt size={18} /> },
  { name: 'Electronics', icon: <Laptop size={18} /> },
  { name: 'Documents', icon: <FileText size={18} /> },
  { name: 'Medicine', icon: <Pill size={18} /> },
  { name: 'General', icon: <Package size={18} /> },
];

const PackingList = () => {
  const { id: tripId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ item_name: '', category: 'General' });

  useEffect(() => {
    fetchPackingList();
  }, [tripId]);

  const fetchPackingList = async () => {
    try {
      const res = await axios.get(`/trips/${tripId}/packing`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch packing list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.item_name.trim()) return;
    try {
      const res = await axios.post(`/trips/${tripId}/packing`, newItem);
      setItems([...items, res.data]);
      setNewItem({ item_name: '', category: 'General' });
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  const handleTogglePacked = async (item) => {
    try {
      await axios.put(`/trips/${tripId}/packing/${item.id}`, { is_packed: !item.is_packed });
      setItems(items.map(i => i.id === item.id ? { ...i, is_packed: !i.is_packed } : i));
    } catch (err) {
      console.error('Failed to toggle item', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/trips/${tripId}/packing/${itemId}`);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`/trips/${tripId}/packing/reset`);
      setItems(items.map(i => ({ ...i, is_packed: false })));
    } catch (err) {
      console.error('Failed to reset list', err);
    }
  };

  const packedCount = items.filter(i => i.is_packed).length;
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  if (loading) return <div className="p-10 text-center animate-pulse">Loading checklist...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Packing Checklist</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Don't leave anything behind!</p>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 font-black text-sm transition-colors"
        >
          <RotateCcw size={16} /> Reset List
        </button>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-8 border-white/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Packing Progress</span>
          <span className="text-teal-600 dark:text-teal-400 font-black text-3xl">{progress}%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-teal-500 transition-all duration-700 ease-out shadow-lg shadow-teal-500/30"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {packedCount} of {items.length} items packed
        </p>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="glass-card p-4 flex flex-col md:flex-row gap-4 border-white/20">
        <div className="flex-1 relative group">
          <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Add new item (e.g. Passport, Socks...)" 
            className="input-field pl-12"
            value={newItem.item_name}
            onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
          />
        </div>
        <select 
          className="input-field w-full md:w-48 font-black"
          value={newItem.category}
          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.name} value={cat.name} className="dark:bg-slate-900">{cat.name}</option>
          ))}
        </select>
        <button 
          type="submit"
          className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={22} /> Add Item
        </button>
      </form>

      {/* Checklist by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map(category => {
          const categoryItems = items.filter(i => i.category === category.name);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.name} className="glass-card p-8 border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
                  {category.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{category.name}</h3>
                <span className="ml-auto bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {categoryItems.length}
                </span>
              </div>

              <div className="space-y-3">
                {categoryItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${item.is_packed ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-40' : 'bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 hover:translate-x-1 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => handleTogglePacked(item)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      {item.is_packed ? (
                        <CheckCircle2 size={24} className="text-teal-500" />
                      ) : (
                        <Circle size={24} className="text-slate-200 dark:text-slate-700" />
                      )}
                      <span className={`font-bold transition-all ${item.is_packed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {item.item_name}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-slate-200 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="glass-card p-20 border-dashed border-2 border-slate-200 dark:border-slate-800 text-center">
          <Search size={48} className="mx-auto mb-6 text-slate-200 dark:text-slate-800" />
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Your checklist is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Add some items above to get started with your packing!</p>
        </div>
      )}
    </div>
  );
};

export default PackingList;
