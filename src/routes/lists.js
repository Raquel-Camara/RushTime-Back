const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getContenido,
  añadirContenido,
  actualizarEstado,
  toggleFavorito,
  eliminarContenido
} = require('../controllers/listsController');

router.get('/', authMiddleware, getContenido);
router.post('/', authMiddleware, añadirContenido);
router.put('/:id', authMiddleware, actualizarEstado);
router.post('/favorite', authMiddleware, toggleFavorito);
router.delete('/:id', authMiddleware, eliminarContenido);

module.exports = router;