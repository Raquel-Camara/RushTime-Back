const axios = require('axios');
require('dotenv').config();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

//obtiene las películas y series en tendencia de la semana
const getTrending = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/all/week`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tendencias' });
    }
};

//busca películas y series por texto
const searchContent = async (req, res) => {
    const { q } = req.query;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
            params: { api_key: TMDB_API_KEY, query: q, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

//obtiene el detalle de una película por su id
const getMovieDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener película' });
    }
};

//obtiene el detalle de una serie por su id
const getSerieDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener serie' });
    }
};

//obtiene las películas más populares
const getPopularMovies = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas populares' });
    }
};

//obtiene las series más populares
const getPopularSeries = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener series populares' });
    }
};

//obtiene películas filtradas por género, año y valoración
const getMovies = async (req, res) => {
    const { genero, anio, valoracion, pagina = 1 } = req.query
    try {
        const params = {
        api_key: TMDB_API_KEY,
        language: 'es-ES',
        page: pagina,
        sort_by: 'popularity.desc'
        }

        //añadimos filtros solo si vienen en la petición
        if (genero) params.with_genres = genero
        if (anio) params.primary_release_year = anio
        if (valoracion) params['vote_average.gte'] = valoracion

        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params })
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener películas' })
    }
}

//obtiene series filtradas por género, año y valoración
const getSeries = async (req, res) => {
    const { genero, anio, valoracion, pagina = 1 } = req.query
    try {
        const params = {
            api_key: TMDB_API_KEY,
            language: 'es-ES',
            page: pagina,
            sort_by: 'popularity.desc'
        }

        if (genero) params.with_genres = genero
        if (anio) params.first_air_date_year = anio
        if (valoracion) params['vote_average.gte'] = valoracion

        const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, { params })
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener series' })
    }
}

//obtiene los géneros de películas de tmdb
const getGenerosPeliculas = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        })
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener géneros' })
    }
}

//obtiene los géneros de series de tmdb
const getGenerosSeries = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
            params: { api_key: TMDB_API_KEY, language: 'es-ES' }
        })
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener géneros' })
    }
}

module.exports = {
    getTrending,
    searchContent,
    getMovieDetail,
    getSerieDetail,
    getPopularMovies,
    getPopularSeries,
    getMovies,
    getSeries,
    getGenerosPeliculas,
    getGenerosSeries
};