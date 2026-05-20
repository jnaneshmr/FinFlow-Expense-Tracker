// src/routes/budget.routes.js
const express = require('express');
const { getAll, create, update, remove } = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(protect);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
module.exports = router;
