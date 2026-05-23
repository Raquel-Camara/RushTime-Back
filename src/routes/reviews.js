const express = require('express');
const router = express.Router();
const { getReviews, createReview, updateReview, deleteReview, getRecentReviews } = require('../controllers/reviewsController');
const authMiddleware = require('../middleware/auth');

//esta ruta tiene que ir ANTES de /:id
router.get('/recent', getRecentReviews);
router.get('/', getReviews);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;