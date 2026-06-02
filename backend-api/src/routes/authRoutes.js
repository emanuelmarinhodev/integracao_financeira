const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/auth/cadastro', authController.cadastrar)
router.post('/auth/login', authController.login)
router.get('/auth/usuarios/:id', authController.buscarPerfil)
router.put('/auth/usuarios/:id', authController.atualizarPerfil)
router.get('/auth/usuarios/:id/simulacoes', authController.listarHistorico)

module.exports = router
