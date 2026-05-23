const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El usuario o email ya existe' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );

        //los nuevos usuarios siempre serán 'user' por defecto
        const token = jwt.sign(
            { id: result.insertId, username, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, username, role: 'user' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        //devolvemos también el avatar para guardarlo en el store
        res.json({ token, username: user.username, role: user.role, avatar: user.avatar });
    } catch (error) {
        //para mostrar el error exacto en la terminal (node)
        console.error('Error en login:', error)
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

    if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//actualiza el nombre de usuario y/o avatar del usuario logueado
const updateProfile = async (req, res) => {
    const { username, avatar } = req.body;
    try {
        //comprobamos que el nuevo username no esté ya en uso
        if (username) {
            const [existing] = await pool.query(
                'SELECT id FROM users WHERE username = ? AND id != ?',
            [username, req.user.id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Ese nombre de usuario ya está en uso' });
        }
        }

        await pool.query(
            'UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar) WHERE id = ?',
        [username || null, avatar || null, req.user.id]
        );

        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

module.exports = { register, login, getMe, updateProfile };