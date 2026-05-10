import db from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_trips }]] = await db.query('SELECT COUNT(*) as total_trips FROM trips');
    const [[{ total_activities }]] = await db.query('SELECT COUNT(*) as total_activities FROM activities');
    
    const [top_destinations] = await db.query(
      'SELECT city_name, COUNT(*) as count FROM trip_stops GROUP BY city_name ORDER BY count DESC LIMIT 5'
    );

    const [user_growth] = await db.query(
      "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM users GROUP BY month ORDER BY month DESC LIMIT 6"
    );

    const [trip_trends] = await db.query(
      "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM trips GROUP BY month ORDER BY month DESC LIMIT 6"
    );

    res.status(200).json({
      stats: {
        total_users,
        total_trips,
        total_activities,
      },
      top_destinations,
      user_growth: user_growth.reverse(),
      trip_trends: trip_trends.reverse()
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, name, email, role, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [users] = await db.query(query, params);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
