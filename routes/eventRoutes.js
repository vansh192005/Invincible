const express = require('express');
const router = express.Router();
const db = require('../database/eventDb');

router.get('/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);

    if (rows.length === 0) {
      return res.status(404).send('Event not found');
    }

    const event = rows[0];
    res.render('eventDetails', { event });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
