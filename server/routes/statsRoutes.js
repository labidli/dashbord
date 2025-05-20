const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const statsController = require('../controllers/statsController');

// GET all stats
router.get('/', auth, statsController.getAllStats);

// POST /stats
router.post('/', auth, statsController.createStats);

// PUT update stat by ID
router.put('/:id', auth, statsController.updateStats);

// DELETE stat by ID
router.delete('/:id', auth, statsController.deleteStats);

router.post('/bulk', auth, statsController.createStatsBulk);
module.exports = router;

module.exports = router;
