const express = require('express');
const router = express.Router();

function getThemeClassName(theme = 'light') {
  return theme === 'dark' ? 'dark-theme' : '';
}

router.get('/', (req, res) => {
  const { theme } = req.cookies;
  res.render('home', { title: 'Hey', theme: getThemeClassName(theme) });
});

router.get('/search', (req, res) => {
  const { theme } = req.cookies;
  res.render('search', { name: req.query.t, theme: getThemeClassName(theme) });
});

router.get('/book', (req, res) => {
  const { theme } = req.cookies;
  res.render('book', { name: req.query.t, theme: getThemeClassName(theme)});
});

router.get('/chapter', (req, res) => {
  const { theme } = req.cookies;
  res.render('chapter', { name: req.query.t, theme: getThemeClassName(theme) });
});

module.exports = router;
