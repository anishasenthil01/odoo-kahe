import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, Plus, Trash2, Edit3, Save, X, 
  Calendar, Clock, Search, MoreVertical 
} from 'lucide-react';

const TripNotes = () => {
  const { id: tripId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [tripId]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`/trips/${tripId}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!noteContent.trim()) return;
    try {
      if (editingId) {
        await axios.put(`/trips/${tripId}/notes/${editingId}`, { content: noteContent });
      } else {
        await axios.post(`/trips/${tripId}/notes`, { content: noteContent });
      }
      setNoteContent('');
      setEditingId(null);
      setIsAdding(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await axios.delete(`/trips/${tripId}/notes/${noteId}`);
        setNotes(notes.filter(n => n.id !== noteId));
      } catch (err) {
        console.error('Failed to delete note', err);
      }
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setNoteContent(note.content);
    setIsAdding(true);
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading journal...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Trip Journal</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Capture your memories and important details.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> New Entry
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass-card p-8 border-white/20 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </h3>
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); setNoteContent(''); }}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <textarea 
            className="input-field h-64 py-6 px-8 mb-8 resize-none text-lg leading-relaxed"
            placeholder="Write your thoughts here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-6">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); setNoteContent(''); }}
              className="px-6 py-3 text-slate-400 dark:text-slate-500 font-black hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="btn-primary px-10 flex items-center gap-3"
            >
              <Save size={20} /> {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="glass-card p-8 border-white/20 group hover:translate-y-[-4px] transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
                      {new Date(note.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1.5">
                      <Clock size={14} className="text-teal-500" /> {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => startEdit(note)}
                    className="p-3 text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-3 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        ) : !isAdding && (
          <div className="glass-card p-20 border-dashed border-2 border-slate-200 dark:border-slate-800 text-center">
            <FileText size={48} className="mx-auto mb-6 text-slate-200 dark:text-slate-800" />
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No journal entries yet</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Start documenting your journey by creating your first entry!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripNotes;
