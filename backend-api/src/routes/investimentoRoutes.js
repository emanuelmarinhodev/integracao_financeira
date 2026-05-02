const express = require('express')
const router = express.Router()
const investimentoController = require('../controllers/investimentoController')
const usuarioController = require('../controllers/usuarioController')

router.get('/indicadores', investimentoController.getIndicadores)

module.exports = router