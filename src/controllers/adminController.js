const pool = require('../config/db');

//obtiene la lista completa de usuarios registrados
const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
    res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

//elimina un usuario por su id
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        //no permitimos que el admin se elimine a sí mismo
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
        }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

//cambia el rol de un usuario entre 'user' y 'admin'
const cambiarRol = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el rol' });
    }
};

//obtiene todas las reseñas de todos los usuarios
const getResenias = async (req, res) => {
    try {
        const [resenias] = await pool.query(
            `SELECT r.*, u.username FROM reviews r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC`
        );
        res.json(resenias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

//elimina cualquier reseña por su id
const eliminarResenia = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
        res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};

//obtiene estadísticas generales de la app
const getEstadisticas = async (req, res) => {
  try {
    const [[{ totalUsuarios }]] = await pool.query(
      'SELECT COUNT(*) as totalUsuarios FROM users'
    );
    const [[{ totalResenias }]] = await pool.query(
      'SELECT COUNT(*) as totalResenias FROM reviews'
    );
    //ahora usamos user_content en vez de list_items
    const [[{ totalItems }]] = await pool.query(
      'SELECT COUNT(*) as totalItems FROM user_content'
    );

    //contenido más guardado
    const [masGuardado] = await pool.query(
      `SELECT tmdb_id, media_type, COUNT(*) as veces
       FROM user_content
       GROUP BY tmdb_id, media_type
       ORDER BY veces DESC
       LIMIT 5`
    );

    res.json({ totalUsuarios, totalResenias, totalItems, masGuardado });
  } catch (error) {
    console.error('Error en estadísticas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = {
    getUsuarios,
    eliminarUsuario,
    cambiarRol,
    getResenias,
    eliminarResenia,
    getEstadisticas
};