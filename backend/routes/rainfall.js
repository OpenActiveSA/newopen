const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure table exists (best-effort)
async function ensureTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS rainfall (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farm_id INT NOT NULL,
        date DATE NOT NULL,
        amount_mm DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT NULL,
        recorded_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_farm_date (farm_id, date)
      ) ENGINE=InnoDB;
    `);
  } catch (e) {
    // ignore - table may already exist without privileges to alter
  }
}
ensureTable();

// GET rainfall for a farm (ordered desc)
router.get('/farms/:farmId/rainfall', async (req, res) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    if (Number.isNaN(farmId)) return res.status(400).json({ error: 'Invalid farm id' });

    const result = await query(
      `SELECT id, farm_id, date, amount_mm, notes, recorded_by, created_at
       FROM rainfall
       WHERE farm_id = ?
       ORDER BY date DESC`,
      [farmId]
    );
    res.json({ rainfall: result.rows });
  } catch (e) {
    console.error('Get rainfall error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST upsert rainfall for a date
router.post(
  '/farms/:farmId/rainfall',
  authenticateToken,
  [
    body('date').isISO8601().toDate(),
    body('amount_mm').isFloat({ min: 0 }),
    body('notes').optional().isString().trim().isLength({ max: 1000 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      const farmId = parseInt(req.params.farmId, 10);
      if (Number.isNaN(farmId)) return res.status(400).json({ error: 'Invalid farm id' });

      const { date, amount_mm, notes } = req.body;
      const userId = req.user?.userId || req.user?.id || null;

      // Upsert by (farm_id, date)
      await query(
        `INSERT INTO rainfall (farm_id, date, amount_mm, notes, recorded_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE amount_mm = VALUES(amount_mm), notes = VALUES(notes), recorded_by = VALUES(recorded_by)`,
        [farmId, date, amount_mm, notes || null, userId]
      );

      const refreshed = await query(
        `SELECT id, farm_id, date, amount_mm, notes, recorded_by, created_at
         FROM rainfall WHERE farm_id = ? AND date = ?`,
        [farmId, date]
      );

      res.status(201).json({ message: 'Saved', record: refreshed.rows[0] });
    } catch (e) {
      console.error('Save rainfall error:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE rainfall by id
router.delete('/rainfall/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    await query('DELETE FROM rainfall WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error('Delete rainfall error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Aggregated rainfall grouped by year -> months
router.get('/farms/:farmId/rainfall/summary', async (req, res) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    if (Number.isNaN(farmId)) return res.status(400).json({ error: 'Invalid farm id' });

    const result = await query(
      `SELECT YEAR(date) as year, MONTH(date) as month, SUM(amount_mm) as total_mm
       FROM rainfall WHERE farm_id = ?
       GROUP BY YEAR(date), MONTH(date)
       ORDER BY YEAR(date) DESC, MONTH(date) ASC`,
      [farmId]
    );

    const byYear = {};
    for (const row of result.rows) {
      const y = String(row.year);
      const m = String(row.month).padStart(2, '0');
      if (!byYear[y]) byYear[y] = {};
      byYear[y][m] = Number(row.total_mm);
    }

    res.json({ summary: byYear });
  } catch (e) {
    console.error('Summary rainfall error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


