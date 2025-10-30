const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT 
        id, email, name, phone, role, avatar_url, created_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's club relationships
router.get('/me/clubs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT 
        cr.club_id,
        cr.relationship_type,
        cr.joined_at,
        c.name as club_name,
        c.slug as club_slug
      FROM club_relationships cr
      JOIN clubs c ON cr.club_id = c.id
      WHERE cr.user_id = ? AND cr.is_active = true
    `, [userId]);

    res.json(result.rows);

  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alias: Get user's farm relationships (same data for now)
router.get('/me/farms', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT 
        cr.club_id,
        cr.relationship_type,
        cr.joined_at,
        c.name as club_name,
        c.slug as club_slug
      FROM club_relationships cr
      JOIN clubs c ON cr.club_id = c.id
      WHERE cr.user_id = ? AND cr.is_active = true
    `, [userId]);

    res.json(result.rows);

  } catch (error) {
    console.error('Get user farms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users with their club relationships (OpenActive users only)
router.get('/', authenticateToken, requireRole('openactive_user'), async (req, res) => {
  try {
    // Get all users
    const usersResult = await query(`
      SELECT 
        id, email, name, phone, role, avatar_url, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    // Get club relationships for all users
    const relationshipsResult = await query(`
      SELECT 
        cr.user_id,
        cr.club_id,
        cr.relationship_type,
        cr.joined_at,
        c.name as club_name,
        c.slug as club_slug
      FROM club_relationships cr
      JOIN clubs c ON cr.club_id = c.id
      WHERE cr.is_active = true
    `);

    // Combine users with their club relationships
    const users = usersResult.rows.map(user => ({
      ...user,
      clubs: relationshipsResult.rows
        .filter(rel => rel.user_id === user.id)
        .map(rel => ({
          clubId: rel.club_id,
          clubName: rel.club_name,
          clubSlug: rel.club_slug,
          role: rel.relationship_type,
          joinedAt: rel.joined_at
        }))
    }));

    res.json({
      users,
      totalUsers: users.length
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
      WHERE id = ?
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

    await query(`
      UPDATE users 
      SET role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [role, userId]);

    // Get the updated user
    const updatedUser = await query(`
      SELECT id, email, name, role, updated_at
      FROM users
      WHERE id = ?
    `, [userId]);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: updatedUser.rows[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;





