import db from '../config/db.js';

export const addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { city_name, country, start_date, end_date } = req.body;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    // Get current max order_index
    const [stops] = await db.query('SELECT MAX(order_index) as max_order FROM trip_stops WHERE trip_id = ?', [tripId]);
    const nextOrder = (stops[0].max_order || 0) + 1;

    const formattedStart = start_date ? (typeof start_date === 'string' && start_date.includes('T') ? start_date.split('T')[0] : start_date) : null;
    const formattedEnd = end_date ? (typeof end_date === 'string' && end_date.includes('T') ? end_date.split('T')[0] : end_date) : null;

    const [result] = await db.query(
      'INSERT INTO trip_stops (trip_id, city_name, country, start_date, end_date, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [tripId, city_name, country, formattedStart, formattedEnd, nextOrder]
    );

    res.status(201).json({ message: 'Stop added successfully', stopId: result.insertId });
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStops = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [stops] = await db.query('SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY order_index ASC', [tripId]);
    res.status(200).json(stops);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('DELETE FROM trip_stops WHERE id = ? AND trip_id = ?', [stopId, tripId]);
    res.status(200).json({ message: 'Stop deleted successfully' });
  } catch (error) {
    console.error('Error deleting stop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
