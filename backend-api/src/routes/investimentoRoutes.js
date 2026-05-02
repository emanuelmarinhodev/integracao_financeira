const express = require('express')
const router = express.Router()
const investimentoController = require('../controllers/investimentoController')

router.get('/indicadores', investimentoController.getIndicadores)

module.exports = router