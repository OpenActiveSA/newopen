const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (OpenActive users only)
router.get('/', authenticateToken, requireRole('openactive_user'), async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, email, name, phone, role, avatar_url, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      users: result.rows
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Users can only view their own profile unless they're OpenActive users
    if (currentUserRole !== 'openactive_user' && currentUserId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(`
      SELECT 
        id, email, name, phone, role, avatar_url, created_at
      FROM users 
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (OpenActive users only)
router.put('/:userId/role', authenticateToken, requireRole('openactive_user'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['openactive_user', 'club_manager', 'member', 'visitor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role', 
        validRoles 
      });
    }

    const result = await query(`
      UPDATE users 
      SET role = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, name, role, updated_at
    `, [role, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;




