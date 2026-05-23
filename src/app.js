const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tmdbRoutes = require('./routes/tmdb');
const listsRoutes = require('./routes/lists');
const reviewsRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const customListsRoutes = require('./routes/customLists');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/custom-lists', customListsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});