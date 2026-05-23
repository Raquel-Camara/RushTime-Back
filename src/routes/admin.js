const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const {
    getUsuarios,
    eliminarUsuario,
    cambiarRol,
    getResenias,
    eliminarResenia,
    getEstadisticas
} = require('../controllers/adminController');

//todas las rutas de admin requieren estar logueado Y ser admin
router.get('/usuarios', authMiddleware, adminMiddleware, getUsuarios);
router.delete('/usuarios/:id', authMiddleware, adminMiddleware, eliminarUsuario);
router.put('/usuarios/:id/rol', authMiddleware, adminMiddleware, cambiarRol);
router.get('/resenias', authMiddleware, adminMiddleware, getResenias);
router.delete('/resenias/:id', authMiddleware, adminMiddleware, eliminarResenia);
router.get('/estadisticas', authMiddleware, adminMiddleware, getEstadisticas);

module.exports = router;