import db from '../config/db.js';

export const getNotes = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [notes] = await db.query('SELECT * FROM notes WHERE trip_id = ? ORDER BY created_at DESC', [tripId]);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addNote = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { content } = req.body;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [result] = await db.query(
      'INSERT INTO notes (trip_id, content) VALUES (?, ?)',
      [tripId, content]
    );

    res.status(201).json({ id: result.insertId, content, created_at: new Date() });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;
    const { content } = req.body;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('UPDATE notes SET content = ? WHERE id = ? AND trip_id = ?', [content, noteId, tripId]);
    res.status(200).json({ message: 'Note updated' });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('DELETE FROM notes WHERE id = ? AND trip_id = ?', [noteId, tripId]);
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
