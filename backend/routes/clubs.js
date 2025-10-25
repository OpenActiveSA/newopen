const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireRole, requireClubAccess, requireClubManager } = require('../middleware/auth');

const router = express.Router();

// Get all active clubs
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, name, slug, description, address, phone, email, website, logo_url,
        settings, is_active, created_at
      FROM clubs 
      WHERE is_active = true 
      ORDER BY name
    `);

    res.json({
      clubs: result.rows
    });

  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get club by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(`
      SELECT 
        id, name, slug, description, address, phone, email, website, logo_url,
        settings, is_active, created_at
      FROM clubs 
      WHERE slug = $1 AND is_active = true
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json({
      club: result.rows[0]
    });

  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new club
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }),
  body('slug').trim().isLength({ min: 1 }).matches(/^[a-z0-9-]+$/),
  body('description').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().isMobilePhone(),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, slug, description, address, phone, email, website } = req.body;
    const userId = req.user.id;

    // Check if slug already exists
    const existingClub = await query(
      'SELECT id FROM clubs WHERE slug = $1',
      [slug]
    );

    if (existingClub.rows.length > 0) {
      return res.status(400).json({ error: 'Club slug already exists' });
    }

    // Create club
    const clubResult = await query(`
      INSERT INTO clubs (name, slug, description, address, phone, email, website)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, slug, description, address, phone, email, website, created_at
    `, [name, slug, description, address, phone, email, website]);

    const club = clubResult.rows[0];

    // Add creator as manager
    await query(`
      INSERT INTO club_relationships (user_id, club_id, relationship_type)
      VALUES ($1, $2, 'manager')
    `, [userId, club.id]);

    res.status(201).json({
      message: 'Club created successfully',
      club
    });

  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update club
router.put('/:clubId', authenticateToken, requireClubManager, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().isMobilePhone(),
  body('email').optional().isEmail(),
  body('website').optional().isURL()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { clubId } = req.params;
    const { name, description, address, phone, email, website, settings } = req.body;

    // Update club
    const result = await query(`
      UPDATE clubs 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        address = COALESCE($3, address),
        phone = COALESCE($4, phone),
        email = COALESCE($5, email),
        website = COALESCE($6, website),
        settings = COALESCE($7, settings),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, name, slug, description, address, phone, email, website, settings, updated_at
    `, [name, description, address, phone, email, website, settings, clubId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json({
      message: 'Club updated successfully',
      club: result.rows[0]
    });

  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get club members
router.get('/:clubId/members', authenticateToken, requireClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;

    const result = await query(`
      SELECT 
        u.id, u.email, u.name, u.phone, u.avatar_url,
        cr.relationship_type, cr.joined_at
      FROM club_relationships cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.club_id = $1 AND cr.is_active = true
      ORDER BY cr.joined_at
    `, [clubId]);

    res.json({
      members: result.rows
    });

  } catch (error) {
    console.error('Get club members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add user to club
router.post('/:clubId/members', authenticateToken, requireClubManager, [
  body('userId').isUUID(),
  body('relationshipType').isIn(['manager', 'member', 'visitor'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { clubId } = req.params;
    const { userId, relationshipType } = req.body;

    // Check if user exists
    const userResult = await query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if relationship already exists
    const existingRelationship = await query(
      'SELECT id FROM club_relationships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    if (existingRelationship.rows.length > 0) {
      return res.status(400).json({ error: 'User is already a member of this club' });
    }

    // Add user to club
    await query(`
      INSERT INTO club_relationships (user_id, club_id, relationship_type)
      VALUES ($1, $2, $3)
    `, [userId, clubId, relationshipType]);

    res.status(201).json({
      message: 'User added to club successfully',
      user: userResult.rows[0],
      relationshipType
    });

  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove user from club
router.delete('/:clubId/members/:userId', authenticateToken, requireClubManager, async (req, res) => {
  try {
    const { clubId, userId } = req.params;

    // Remove user from club
    const result = await query(`
      UPDATE club_relationships 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND club_id = $2
      RETURNING id
    `, [userId, clubId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in this club' });
    }

    res.json({
      message: 'User removed from club successfully'
    });

  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get club statistics (for managers)
router.get('/:clubId/stats', authenticateToken, requireClubManager, async (req, res) => {
  try {
    const { clubId } = req.params;

    // Get member count
    const memberCount = await query(`
      SELECT COUNT(*) as count 
      FROM club_relationships 
      WHERE club_id = $1 AND is_active = true
    `, [clubId]);

    // Get court count
    const courtCount = await query(`
      SELECT COUNT(*) as count 
      FROM courts 
      WHERE club_id = $1 AND is_active = true
    `, [clubId]);

    // Get booking count (last 30 days)
    const bookingCount = await query(`
      SELECT COUNT(*) as count 
      FROM bookings 
      WHERE club_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
    `, [clubId]);

    res.json({
      stats: {
        members: parseInt(memberCount.rows[0].count),
        courts: parseInt(courtCount.rows[0].count),
        bookingsLast30Days: parseInt(bookingCount.rows[0].count)
      }
    });

  } catch (error) {
    console.error('Get club stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



