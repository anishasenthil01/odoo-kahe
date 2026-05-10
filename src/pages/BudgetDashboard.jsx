import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Wallet, TrendingDown, Calendar, AlertCircle, Plus, Trash2, DollarSign } from 'lucide-react';

const COLORS = ['#14b8a6', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

const BudgetDashboard = () => {
  const { id: tripId } = useParams();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'Transport', amount: '' });

  useEffect(() => {
    fetchBudget();
  }, [tripId]);

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`/trips/${tripId}/budget`);
      setBudgetData(res.data);
    } catch (err) {
      console.error('Failed to fetch budget', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/trips/${tripId}/budget`, newItem);
      setNewItem({ category: 'Transport', amount: '' });
      setShowAddForm(false);
      fetchBudget();
    } catch (err) {
      console.error('Failed to add budget item', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/trips/${tripId}/budget/${itemId}`);
      fetchBudget();
    } catch (err) {
      console.error('Failed to delete budget item', err);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading budget analysis...</div>;
  if (!budgetData) return <div className="p-10 text-center">No budget data found for this trip.</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Budget & Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track and analyze your trip costs.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 flex items-center gap-6 border-white/20">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Budget</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">${budgetData.totalCost.toFixed(2)}</h2>
          </div>
        </div>

        <div className="glass-card p-8 flex items-center gap-6 border-white/20">
          <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 rounded-3xl flex items-center justify-center text-sky-600 dark:text-sky-400">
            <TrendingDown size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Daily Average</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">${budgetData.dailyAverage.toFixed(2)}</h2>
          </div>
        </div>

        <div className="glass-card p-8 flex items-center gap-6 border-white/20">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Duration</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{budgetData.days} Days</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breakdown Chart */}
        <div className="glass-card p-8 border-white/20">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2">
            Cost Breakdown
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="amount"
                  nameKey="category"
                  stroke="none"
                >
                  {budgetData.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ fontWeight: '800' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: '700', fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="glass-card p-8 border-white/20 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Expense List</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {budgetData.breakdown.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 group hover:translate-x-1 transition-all">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.category}</p>
                    {item.is_dynamic && <span className="text-[10px] text-teal-600 dark:text-teal-400 font-black uppercase tracking-widest">Dynamic</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900 dark:text-white text-lg">${item.amount.toFixed(2)}</span>
                  {!item.is_dynamic && (
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAddForm && (
            <form onSubmit={handleAddItem} className="mt-6 p-8 bg-teal-50/50 dark:bg-teal-900/10 rounded-[2rem] border border-teal-100 dark:border-teal-900/20 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest block">Category</label>
                  <select 
                    className="input-field py-3 text-sm"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option>Transport</option>
                    <option>Hotel</option>
                    <option>Meals</option>
                    <option>Shopping</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest block">Amount ($)</label>
                  <input 
                    type="number" 
                    className="input-field py-3 text-sm"
                    placeholder="0.00"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="btn-primary flex-1 py-3 text-sm"
                >
                  Save Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-teal-600 dark:text-teal-400 font-black text-sm hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetData.dailyAverage > 200 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
            <AlertCircle size={28} />
          </div>
          <div className="pt-1">
            <h4 className="text-lg font-black text-amber-900 dark:text-amber-400 mb-1">High Daily Spend Alert</h4>
            <p className="text-amber-700 dark:text-amber-400/70 font-medium leading-relaxed">
              Your average daily spend is quite high (${budgetData.dailyAverage.toFixed(2)}). Consider looking for free activities or more budget-friendly dining options to stay within your limits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;
