const pool = require('../config/db');

//obtiene todas las listas personalizadas del usuario
const getListas = async (req, res) => {
    try {
        const [listas] = await pool.query(
            'SELECT * FROM custom_lists WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
        );
        res.json(listas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listas' });
    }
};

//crea una nueva lista personalizada
const crearLista = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name?.trim()) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
        }
        const [result] = await pool.query(
            'INSERT INTO custom_lists (user_id, name) VALUES (?, ?)',
        [req.user.id, name.trim()]
        );
        res.status(201).json({ id: result.insertId, name: name.trim() });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la lista' });
    }
};

//elimina una lista personalizada
const eliminarLista = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'DELETE FROM custom_lists WHERE id = ? AND user_id = ?',
        [id, req.user.id]
        );
        res.json({ message: 'Lista eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la lista' });
    }
};

//obtiene los items de una lista personalizada
const getItems = async (req, res) => {
    const { id } = req.params;
    try {
        const [items] = await pool.query(
            `SELECT * FROM custom_list_items 
            WHERE custom_list_id = ?
            ORDER BY added_at DESC`,
        [id]
        );
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener items' });
    }
};

//añade un item a una lista personalizada
const añadirItem = async (req, res) => {
    const { id } = req.params;
    const { tmdb_id, media_type } = req.body;
    try {
        //comprobamos que la lista pertenece al usuario
        const [listas] = await pool.query(
            'SELECT id FROM custom_lists WHERE id = ? AND user_id = ?',
        [id, req.user.id]
        );
        if (listas.length === 0) {
        return res.status(403).json({ error: 'Lista no encontrada' });
        }
        const [result] = await pool.query(
            'INSERT INTO custom_list_items (custom_list_id, tmdb_id, media_type) VALUES (?, ?, ?)',
        [id, tmdb_id, media_type]
        );
        res.status(201).json({ id: result.insertId, tmdb_id, media_type });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Este contenido ya está en la lista' });
        }
        res.status(500).json({ error: 'Error al añadir item' });
    }
};

//elimina un item de una lista personalizada
const eliminarItem = async (req, res) => {
    const { id, itemId } = req.params;
    try {
        await pool.query(
            'DELETE FROM custom_list_items WHERE id = ? AND custom_list_id = ?',
        [itemId, id]
        );
        res.json({ message: 'Item eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar item' });
    }
};

module.exports = { getListas, crearLista, eliminarLista, getItems, añadirItem, eliminarItem };