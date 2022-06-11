const express = require('express'),
  albumRoute = require('./album.route'),
  quranRoute = require('./quran.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/album',
    route: albumRoute,
  },
  {
    path: '/quran',
    route: quranRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;