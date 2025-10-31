const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('📥 Request received:', req.method, req.path);
  console.log('📥 Authorization header:', authHeader ? authHeader.substring(0, 30) + '...' : 'MISSING');
  
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('❌ No token in Authorization header');
    console.log('   Full headers:', JSON.stringify(req.headers, null, 2));
    return res.status(401).json({ error: 'Access token required' });
  }

  console.log('🔐 Verifying token:', token.substring(0, 20) + '...');
  console.log('🔐 Token length:', token.length);
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  console.log('🔑 Using JWT_SECRET:', process.env.JWT_SECRET ? 'SET (' + jwtSecret.substring(0, 5) + '...)' : 'DEFAULT (your-secret-key)');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token verified, userId:', decoded.userId);
    
    // Get user from database
    const result = await query(
      'SELECT id, email, display_name AS name FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found for userId:', decoded.userId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's roles
    const rolesResult = await query(`
      SELECT r.name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `, [decoded.userId]);

    const userRoles = rolesResult.rows.map(r => r.name);
    const primaryRole = userRoles[0] || null;

    console.log('✅ User found:', result.rows[0].email, 'Roles:', userRoles);
    req.user = { 
      ...result.rows[0], 
      userId: result.rows[0].id,
      roles: userRoles,
      role: primaryRole // For backward compatibility
    };
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.name, error.message);
    if (error.name === 'JsonWebTokenError') {
      console.error('   Token format issue or secret mismatch');
    } else if (error.name === 'TokenExpiredError') {
      console.error('   Token expired at:', error.expiredAt);
    }
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles || [];
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user has any of the required roles
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRoles
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
    const userRoles = req.user.roles || [];

    // OpenFarm users have access to everything
    if (userRoles.includes('openfarm_user')) {
      return next();
    }

    if (!clubId) {
      return res.status(400).json({ error: 'Club ID required' });
    }

    // Check if user has relationship with club
    const result = await query(`
      SELECT relationship_type 
      FROM club_relationships 
      WHERE user_id = ? AND club_id = ? AND is_active = true
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
    const userRoles = req.user.roles || [];

    // OpenFarm users have access to everything
    if (userRoles.includes('openfarm_user')) {
      return next();
    }

    if (!clubId) {
      return res.status(400).json({ error: 'Club ID required' });
    }

    // Check if user is club manager
    const result = await query(`
      SELECT relationship_type 
      FROM club_relationships 
      WHERE user_id = ? AND club_id = ? AND relationship_type = 'manager' AND is_active = true
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





