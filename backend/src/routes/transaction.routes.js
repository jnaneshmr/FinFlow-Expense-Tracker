// src/routes/transaction.routes.js
const express = require('express');
const { getAll, getOne, create, update, remove, getSummary } = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(protect);
router.get('/', getAll);
router.get('/summary', getSummary);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
module.exports = router;
