const express = require('express'),
    quranController = require('../controllers/quran.controller');

const router = express.Router();

// API
router
    .route('/api')
    .get(quranController.getSurahs)

// get ayat
router
    .route('/api/:id')
    .get(quranController.getAyahs)

module.exports = router;