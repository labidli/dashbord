const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const statsController = require('../controllers/statsController');

// GET all stats
router.get('/', auth, statsController.getAllStats);

// PUT update stat by ID
router.put('/:id', auth, statsController.updateStats);

// DELETE stat by ID
router.delete('/:id', auth, statsController.deleteStats);

module.exports = router;
