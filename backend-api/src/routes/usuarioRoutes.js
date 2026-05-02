const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')

router.post('/usuarios', usuarioController.cadastro)
router.get('/usuarios', usuarioController.listar)
router.put('/usuarios/:id', usuarioController.atualizar)
router.delete('/usuarios/:id', usuarioController.deletar)

module.exports = router