const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/tmdbController')

router.get('/trending', getTrending)
router.get('/search', searchContent)
router.get('/movie/:id', getMovieDetail)
router.get('/serie/:id', getSerieDetail)
router.get('/popular/movies', getPopularMovies)
router.get('/popular/series', getPopularSeries)
router.get('/movies', getMovies)
router.get('/series', getSeries)
router.get('/generos/movies', getGenerosPeliculas)
router.get('/generos/series', getGenerosSeries)

module.exports = router