const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const result = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Check if user is club manager or has global admin role
const requireClubAccess = async (req, res, next) => {
  try {
    const clubId = req.params.clubId || req.body.club_id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // OpenActive users have access to everything
    if (userRole === 'openactive_user') {
      return next();
    }

    if (!clubId) {
      return res.status(400).json({ error: 'Club ID required' });
    }

    // Check if user has relationship with club
    const result = await query(`
      SELECT relationship_type 
      FROM club_relationships 
      WHERE user_id = $1 AND club_id = $2 AND is_active = true
    `, [userId, clubId]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No access to this club' });
    }

    const relationshipType = result.rows[0].relationship_type;
    
    // Allow managers and members to access club data
    if (['manager', 'member', 'visitor'].includes(relationshipType)) {
      req.user.clubRole = relationshipType;
      return next();
    }

    return res.status(403).json({ error: 'Insufficient club permissions' });
  } catch (error) {
    console.error('Club access check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user is club manager
const requireClubManager = async (req, res, next) => {
  try {
    const clubId = req.params.clubId || req.body.club_id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // OpenActive users have access to everything
    if (userRole === 'openactive_user') {
      return next();
    }

    if (!clubId) {
      return res.status(400).json({ error: 'Club ID required' });
    }

    // Check if user is club manager
    const result = await query(`
      SELECT relationship_type 
      FROM club_relationships 
      WHERE user_id = $1 AND club_id = $2 AND relationship_type = 'manager' AND is_active = true
    `, [userId, clubId]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Club manager access required' });
    }

    req.user.clubRole = 'manager';
    next();
  } catch (error) {
    console.error('Club manager check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireClubAccess,
  requireClubManager
};


