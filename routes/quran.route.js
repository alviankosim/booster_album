const express = require('express'),
    quranController = require('../controllers/quran.controller');

const router = express.Router();

// API
router
    .route('/api')
    .get(quranController.getSurahs)

module.exports = router;