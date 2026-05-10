import db from '../config/db.js';

export const addActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stop_id, title, description, type, cost, currency, duration_minutes, rating, image_url } = req.body;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [result] = await db.query(
      `INSERT INTO activities 
      (trip_id, stop_id, title, description, type, cost, currency, duration_minutes, rating, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tripId, stop_id, title, description, type, cost || 0, currency || 'USD', duration_minutes || null, rating || null, image_url || null]
    );

    res.status(201).json({ message: 'Activity added successfully', activityId: result.insertId });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [activities] = await db.query('SELECT * FROM activities WHERE trip_id = ?', [tripId]);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { tripId, activityId } = req.params;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('DELETE FROM activities WHERE id = ? AND trip_id = ?', [activityId, tripId]);
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
