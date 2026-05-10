import db from '../config/db.js';

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const { name, description, start_date, end_date, is_public } = req.body;
    const user_id = req.user.id;
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

    const formattedStart = start_date ? (typeof start_date === 'string' && start_date.includes('T') ? start_date.split('T')[0] : start_date) : null;
    const formattedEnd = end_date ? (typeof end_date === 'string' && end_date.includes('T') ? end_date.split('T')[0] : end_date) : null;

    const [result] = await db.query(
      'INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, description, formattedStart, formattedEnd, cover_image, is_public || false]
    );

    res.status(201).json({ message: 'Trip created successfully', tripId: result.insertId });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server error creating trip' });
  }
};

// Get all trips for the logged-in user
export const getUserTrips = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [trips] = await db.query(
      'SELECT t.*, (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) as stop_count FROM trips t WHERE user_id = ? ORDER BY start_date ASC',
      [user_id]
    );
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

// Get a single trip by ID (must belong to user or be public)
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [trips] = await db.query(
      'SELECT * FROM trips WHERE id = ? AND (user_id = ? OR is_public = true)',
      [id, user_id]
    );

    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const trip = trips[0];

    // Fetch associated stops
    const [stops] = await db.query('SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY order_index ASC', [id]);
    trip.stops = stops;

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Server error fetching trip' });
  }
};

// Update a trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, is_public } = req.body;
    const user_id = req.user.id;

    // Check ownership
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [id, user_id]);
    if (trips.length === 0) return res.status(404).json({ message: 'Trip not found or unauthorized' });

    let cover_image = trips[0].cover_image;
    if (req.file) {
      cover_image = `/uploads/${req.file.filename}`;
    }

    const formattedStart = start_date ? (typeof start_date === 'string' && start_date.includes('T') ? start_date.split('T')[0] : start_date) : null;
    const formattedEnd = end_date ? (typeof end_date === 'string' && end_date.includes('T') ? end_date.split('T')[0] : end_date) : null;

    await db.query(
      'UPDATE trips SET name = ?, description = ?, start_date = ?, end_date = ?, cover_image = ?, is_public = ? WHERE id = ? AND user_id = ?',
      [name, description, formattedStart, formattedEnd, cover_image, is_public || false, id, user_id]
    );

    res.status(200).json({ message: 'Trip updated successfully' });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Server error updating trip' });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [result] = await db.query('DELETE FROM trips WHERE id = ? AND user_id = ?', [id, user_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Server error deleting trip' });
  }
};

// Copy a trip (duplicate an existing trip and its itinerary)
export const copyTrip = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id: tripId } = req.params;
    const user_id = req.user.id;

    // 1. Get original trip
    const [trips] = await connection.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    if (trips.length === 0) return res.status(404).json({ message: 'Original trip not found' });
    const original = trips[0];

    const formattedStart = original.start_date ? (typeof original.start_date === 'string' && original.start_date.includes('T') ? original.start_date.split('T')[0] : original.start_date) : null;
    const formattedEnd = original.end_date ? (typeof original.end_date === 'string' && original.end_date.includes('T') ? original.end_date.split('T')[0] : original.end_date) : null;

    // 2. Create new trip entry
    const [tripResult] = await connection.query(
      'INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, `Copy of ${original.name}`, original.description, formattedStart, formattedEnd, original.cover_image]
    );
    const newTripId = tripResult.insertId;

    // 3. Get original stops
    const [stops] = await connection.query('SELECT * FROM trip_stops WHERE trip_id = ?', [tripId]);
    
    for (const stop of stops) {
      const stopStart = stop.start_date ? (typeof stop.start_date === 'string' && stop.start_date.includes('T') ? stop.start_date.split('T')[0] : stop.start_date) : null;
      const stopEnd = stop.end_date ? (typeof stop.end_date === 'string' && stop.end_date.includes('T') ? stop.end_date.split('T')[0] : stop.end_date) : null;

      const [stopResult] = await connection.query(
        'INSERT INTO trip_stops (trip_id, city_name, country, start_date, end_date, order_index) VALUES (?, ?, ?, ?, ?, ?)',
        [newTripId, stop.city_name, stop.country, stopStart, stopEnd, stop.order_index]
      );
      const newStopId = stopResult.insertId;

      // 4. Get original activities for this stop
      const [activities] = await connection.query('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
      for (const activity of activities) {
        await connection.query(
          'INSERT INTO activities (trip_id, stop_id, title, type, cost, currency, duration_minutes, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [newTripId, newStopId, activity.title, activity.type, activity.cost, activity.currency, activity.duration_minutes, activity.image_url]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Trip copied successfully', id: newTripId });
  } catch (error) {
    await connection.rollback();
    console.error('Error copying trip:', error);
    res.status(500).json({ message: 'Server error copying trip' });
  } finally {
    connection.release();
  }
};
