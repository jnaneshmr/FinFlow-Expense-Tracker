// src/routes/dashboard.routes.js
const express = require('express');
const { getSummary } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(protect);
router.get('/summary', getSummary);
module.exports = router;
