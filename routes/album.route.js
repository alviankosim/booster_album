const express = require('express'),
    albumController = require('../controllers/album.controller');

const router = express.Router();

// website
router
    .route('/')
    .get(albumController.viewAlbum)

// API
router
    .route('/api')
    .get(albumController.getAlbum)
    .post(albumController.addAlbum)

router
    .route('/api/:id')
    .put(albumController.editAlbum)
    .delete(albumController.deleteAlbum)

module.exports = router;