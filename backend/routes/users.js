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
        id, email, display_name AS name, created_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user's roles
    const rolesResult = await query(`
      SELECT r.name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `, [userId]);

    user.roles = rolesResult.rows.map(r => r.name);
    user.role = user.roles[0] || null; // Primary role for backward compatibility

    res.json(user);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's club relationships
router.get('/me/clubs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if club_relationships table exists, if not return empty array
    try {
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
    } catch (tableError) {
      // If table doesn't exist, return empty array
      if (tableError.code === 'ER_NO_SUCH_TABLE') {
        console.log('club_relationships table does not exist, returning empty array');
        return res.json([]);
      }
      throw tableError;
    }

  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alias: Get user's farm relationships (same data for now)
router.get('/me/farms', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if club_relationships table exists, if not return empty array
    try {
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
    } catch (tableError) {
      // If table doesn't exist, return empty array (for farms, relationships may not be set up yet)
      if (tableError.code === 'ER_NO_SUCH_TABLE') {
        console.log('club_relationships table does not exist, returning empty array');
        return res.json([]);
      }
      throw tableError;
    }

  } catch (error) {
    console.error('Get user farms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users with their roles and farm relationships
// OpenFarm users have full access, others see limited data
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if current user is OpenFarm user
    const currentUserRoles = await query(`
      SELECT r.name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `, [req.user.userId]);
    
    const isOpenFarmUser = currentUserRoles.rows.some(r => r.name === 'openfarm_user');
    
    // Get all users (only select columns that exist)
    const usersResult = await query(`
      SELECT 
        id, email, display_name AS name, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    // Get roles for all users
    const allUserRoles = await query(`
      SELECT ur.user_id, r.name as role_name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
    `);

    // Get farm relationships for all users
    let farmRelationships = { rows: [] };
    try {
      farmRelationships = await query(`
        SELECT 
          uf.user_id,
          uf.farm_id,
          uf.farm_role,
          f.name as farm_name
        FROM user_farms uf
        JOIN farms f ON uf.farm_id = f.id
      `);
    } catch (tableError) {
      // If user_farms table doesn't exist, continue without relationships
      if (tableError.code !== 'ER_NO_SUCH_TABLE') {
        throw tableError;
      }
      console.log('user_farms table does not exist, returning users without farm relationships');
    }

    // Combine users with their roles and farm relationships
    const users = usersResult.rows.map(user => {
      const userRoles = allUserRoles.rows
        .filter(ur => ur.user_id === user.id)
        .map(ur => ur.role_name);
      
      const userFarms = farmRelationships.rows
        .filter(uf => uf.user_id === user.id)
        .map(uf => ({
          farmId: uf.farm_id,
          farmName: uf.farm_name,
          role: uf.farm_role
        }));

      return {
        ...user,
        roles: userRoles,
        role: userRoles[0] || 'member', // Primary role for display
        farms: userFarms
      };
    });

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

// Assign role to user (OpenFarm users only)
router.post('/:userId/roles', authenticateToken, requireRole('openfarm_user'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleName } = req.body;

    const validRoles = ['openfarm_user', 'owner', 'manager'];
    if (!validRoles.includes(roleName)) {
      return res.status(400).json({ 
        error: 'Invalid role', 
        validRoles 
      });
    }

    // Get role ID
    const roleResult = await query('SELECT id FROM roles WHERE name = ?', [roleName]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: 'Role not found' });
    }
    const roleId = roleResult.rows[0].id;

    // Remove existing role assignments for this user, then add new one
    await query('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);
    await query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

    res.json({
      message: 'User role assigned successfully',
      role: roleName
    });

  } catch (error) {
    console.error('Assign user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove role from user (OpenFarm users only)
router.delete('/:userId/roles/:roleName', authenticateToken, requireRole('openfarm_user'), async (req, res) => {
  try {
    const { userId, roleName } = req.params;

    const roleResult = await query('SELECT id FROM roles WHERE name = ?', [roleName]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: 'Role not found' });
    }
    const roleId = roleResult.rows[0].id;

    await query('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);

    res.json({
      message: 'User role removed successfully'
    });

  } catch (error) {
    console.error('Remove user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;





