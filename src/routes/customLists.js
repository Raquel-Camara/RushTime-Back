const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getListas,
    crearLista,
    eliminarLista,
    getItems,
    añadirItem,
    eliminarItem
} = require('../controllers/customListsController');

//todas las rutas requieren estar logueado
router.get('/', authMiddleware, getListas);
router.post('/', authMiddleware, crearLista);
router.delete('/:id', authMiddleware, eliminarLista);
router.get('/:id/items', authMiddleware, getItems);
router.post('/:id/items', authMiddleware, añadirItem);
router.delete('/:id/items/:itemId', authMiddleware, eliminarItem);

module.exports = router;