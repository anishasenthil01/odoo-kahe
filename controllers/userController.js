import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, profile_image, role, language_preference, theme_preference, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, language_preference, theme_preference } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : undefined;

    let query = 'UPDATE users SET ';
    const params = [];
    if (name) {
      query += 'name = ?, ';
      params.push(name);
    }
    if (language_preference) {
      query += 'language_preference = ?, ';
      params.push(language_preference);
    }
    if (theme_preference) {
      query += 'theme_preference = ?, ';
      params.push(theme_preference);
    }
    if (profile_image) {
      query += 'profile_image = ?, ';
      params.push(profile_image);
    }

    if (params.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    params.push(req.user.id);

    await db.query(query, params);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [users] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavedDestinations = async (req, res) => {
  try {
    const [destinations] = await db.query('SELECT * FROM saved_destinations WHERE user_id = ?', [req.user.id]);
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching saved destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveDestination = async (req, res) => {
  try {
    const { city_name, country, image_url } = req.body;
    await db.query(
      'INSERT INTO saved_destinations (user_id, city_name, country, image_url) VALUES (?, ?, ?, ?)',
      [req.user.id, city_name, country, image_url]
    );
    res.status(201).json({ message: 'Destination saved' });
  } catch (error) {
    console.error('Error saving destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const unsaveDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM saved_destinations WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.status(200).json({ message: 'Destination unsaved' });
  } catch (error) {
    console.error('Error unsaving destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
