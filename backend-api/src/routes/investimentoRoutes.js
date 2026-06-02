const express = require('express')
const router = express.Router()
const investimentoController = require('../controllers/investimentoController')

router.get('/indicadores', investimentoController.getIndicadores)
router.get('/indicadores/resumo', investimentoController.getResumoIndicadores)
router.post('/simulacao', investimentoController.simular)
router.get('/simulacoes', investimentoController.listarSimulacoes)
router.get('/supabase/status', investimentoController.getStatusSupabase)
router.get('/simulacao/:id', investimentoController.calcular)

module.exports = router
