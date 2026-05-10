import db from '../config/db.js';

export const getPackingList = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [items] = await db.query('SELECT * FROM packing_lists WHERE trip_id = ?', [tripId]);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching packing list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addPackingItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { item_name, category } = req.body;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [result] = await db.query(
      'INSERT INTO packing_lists (trip_id, item_name, category) VALUES (?, ?, ?)',
      [tripId, item_name, category || 'General']
    );

    res.status(201).json({ id: result.insertId, item_name, category, is_packed: false });
  } catch (error) {
    console.error('Error adding packing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePackingItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const { is_packed, item_name, category } = req.body;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    let query = 'UPDATE packing_lists SET ';
    const params = [];
    if (is_packed !== undefined) {
      query += 'is_packed = ?, ';
      params.push(is_packed);
    }
    if (item_name) {
      query += 'item_name = ?, ';
      params.push(item_name);
    }
    if (category) {
      query += 'category = ?, ';
      params.push(category);
    }
    
    query = query.slice(0, -2); // Remove trailing comma
    query += ' WHERE id = ? AND trip_id = ?';
    params.push(itemId, tripId);

    await db.query(query, params);
    res.status(200).json({ message: 'Item updated' });
  } catch (error) {
    console.error('Error updating packing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePackingItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('DELETE FROM packing_lists WHERE id = ? AND trip_id = ?', [itemId, tripId]);
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting packing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPackingList = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('UPDATE packing_lists SET is_packed = FALSE WHERE trip_id = ?', [tripId]);
    res.status(200).json({ message: 'Packing list reset' });
  } catch (error) {
    console.error('Error resetting packing list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
