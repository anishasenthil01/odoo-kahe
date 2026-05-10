import db from '../config/db.js';

export const getTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip belongs to user
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    // Get specific budget items
    const [budgetItems] = await db.query('SELECT * FROM budgets WHERE trip_id = ?', [tripId]);
    
    // Get activity costs to include in total
    const [activities] = await db.query('SELECT SUM(cost) as total_activity_cost FROM activities WHERE trip_id = ?', [tripId]);
    
    const activityCost = parseFloat(activities[0].total_activity_cost || 0);
    
    // Combine manual budget items with dynamic activity costs
    const breakdown = [
      ...budgetItems.map(item => ({
        id: item.id,
        category: item.category,
        amount: parseFloat(item.amount),
        currency: item.currency
      }))
    ];

    // Add activities category if not present
    if (activityCost > 0) {
      breakdown.push({
        id: 'activities_total',
        category: 'Activities',
        amount: activityCost,
        currency: 'USD',
        is_dynamic: true
      });
    }

    const totalCost = breakdown.reduce((sum, item) => sum + item.amount, 0);

    // Calculate duration for daily average
    const startDate = new Date(trips[0].start_date);
    const endDate = new Date(trips[0].end_date);
    const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const dailyAverage = totalCost / days;

    res.status(200).json({
      totalCost,
      dailyAverage,
      days,
      breakdown
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addBudgetItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, amount, currency } = req.body;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const [result] = await db.query(
      'INSERT INTO budgets (trip_id, category, amount, currency) VALUES (?, ?, ?, ?)',
      [tripId, category, amount, currency || 'USD']
    );

    res.status(201).json({ message: 'Budget item added', id: result.insertId });
  } catch (error) {
    console.error('Error adding budget item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBudgetItem = async (req, res) => {
  try {
    const { tripId, budgetId } = req.params;

    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.id]);
    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await db.query('DELETE FROM budgets WHERE id = ? AND trip_id = ?', [budgetId, tripId]);
    res.status(200).json({ message: 'Budget item deleted' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
