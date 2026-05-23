const pool = require('../config/db');

const getReviews = async (req, res) => {
    const { tmdb_id, media_type } = req.query;
    try {
        const [reviews] = await pool.query(
            `SELECT r.*, u.username FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.tmdb_id = ? AND r.media_type = ?`,
            [tmdb_id, media_type]
        );
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

const createReview = async (req, res) => {
    const { tmdb_id, media_type, rating, content } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO reviews (user_id, tmdb_id, media_type, rating, content) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, tmdb_id, media_type, rating, content]
        );
        res.status(201).json({ id: result.insertId, tmdb_id, media_type, rating, content });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear reseña' });
    }
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, content } = req.body;
    try {
        await pool.query(
            'UPDATE reviews SET rating = ?, content = ? WHERE id = ? AND user_id = ?',
            [rating, content, id, req.user.id]
        );
        res.json({ message: 'Reseña actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar reseña' });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'DELETE FROM reviews WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        res.json({ message: 'Reseña eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};

//obtiene las últimas reseñas de todos los usuarios para mostrar en el home
const getRecentReviews = async (req, res) => {
    try {
        const [reviews] = await pool.query(
            `SELECT r.*, u.username, u.avatar 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 6`
        );
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas recientes' });
    }
};

module.exports = { getReviews, createReview, updateReview, deleteReview, getRecentReviews};