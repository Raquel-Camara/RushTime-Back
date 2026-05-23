const pool = require('../config/db');

//obtiene todo el contenido guardado por el usuario
const getContenido = async (req, res) => {
  try {
    const [contenido] = await pool.query(
      'SELECT * FROM user_content WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(contenido);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contenido' });
  }
};

//añade o actualiza contenido con estado
const añadirContenido = async (req, res) => {
  const { tmdb_id, media_type, status } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT id, is_favorite FROM user_content WHERE user_id = ? AND tmdb_id = ? AND media_type = ?',
      [req.user.id, tmdb_id, media_type]
    );

    if (existing.length > 0) {
      //si ya existe solo actualizamos el status, mantenemos is_favorite intacto
      await pool.query(
        'UPDATE user_content SET status = ? WHERE id = ?',
        [status, existing[0].id]
      );
      return res.json({ message: 'Estado actualizado correctamente' });
    }

    //si no existe lo creamos
    const [result] = await pool.query(
      'INSERT INTO user_content (user_id, tmdb_id, media_type, status) VALUES (?, ?, ?, ?)',
      [req.user.id, tmdb_id, media_type, status]
    );
    res.status(201).json({ id: result.insertId, tmdb_id, media_type, status });
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir contenido' });
  }
};

//actualiza el estado de un contenido
const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE user_content SET status = ? WHERE id = ? AND user_id = ?',
      [status, id, req.user.id]
    );
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

//toggle de favorito — no afecta al estado
const toggleFavorito = async (req, res) => {
  const { tmdb_id, media_type } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT id, is_favorite FROM user_content WHERE user_id = ? AND tmdb_id = ? AND media_type = ?',
      [req.user.id, tmdb_id, media_type]
    );

    if (existing.length > 0) {
      //si ya existe hacemos toggle del favorito
      const nuevoFavorito = existing[0].is_favorite ? 0 : 1
      await pool.query(
        'UPDATE user_content SET is_favorite = ? WHERE id = ?',
        [nuevoFavorito, existing[0].id]
      );
      return res.json({ is_favorite: nuevoFavorito })
    }

    //si no existe lo creamos directamente como favorito sin estado
    const [result] = await pool.query(
      'INSERT INTO user_content (user_id, tmdb_id, media_type, status, is_favorite) VALUES (?, ?, ?, ?, 1)',
      [req.user.id, tmdb_id, media_type, 'watched']
    );
    res.status(201).json({ id: result.insertId, is_favorite: 1 });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
};

//elimina un contenido
const eliminarContenido = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM user_content WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    res.json({ message: 'Contenido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el contenido' });
  }
};

module.exports = { getContenido, añadirContenido, actualizarEstado, toggleFavorito, eliminarContenido };