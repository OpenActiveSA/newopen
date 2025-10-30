const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/farms - list farms (newfarm schema)
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, location, hectares, financial_year_start, created_at
      FROM farms
      ORDER BY name
    `);
    res.json({ farms: result.rows });
  } catch (e) {
    console.error('Get farms error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/farms - create farm (owner must be authenticated)
// Temporarily allow unauthenticated creation while wiring up auth on the UI
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/farms payload:', req.body);
    const { name, location, address, region, hectares, financial_year_start, financialYearStart } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const loc = location || region || address || '';
    const hect = typeof hectares === 'number' ? hectares : (hectares ? parseFloat(hectares) : 0);
    const fys = financial_year_start || financialYearStart || null;

    const insert = await query(
      `INSERT INTO farms (name, location, hectares, financial_year_start)
       VALUES (?, ?, ?, ?)`,
      [name, loc, isNaN(hect) ? 0 : hect, fys]
    );

    const newId = insert.rows?.insertId || insert.insertId;
    const created = await query(
      `SELECT id, name, location, hectares, financial_year_start, created_at
       FROM farms WHERE id = ?`,
      [newId]
    );

    res.status(201).json({ message: 'Farm created', farm: created.rows[0] });
  } catch (e) {
    console.error('Create farm error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


