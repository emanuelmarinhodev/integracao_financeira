const usuarioService = require('../services/usuarioService')

const cadastro = async (req, res) => {
    try {
        const novoUsuario = await usuarioService.criar(req.body)
        res.status(201).json(novoUsuario)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const listar = async (req, res) => {
    try {
        const usuarios = await usuarioService.buscarTodos()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const atualizar = async (req, res) => {
    const {id} = req.params

    try {
        const usuarioAtualizado = await usuarioService.atualizar(id, req.body)
        if(!usuarioAtualizado) {
            return res.status(404).json({error: "Usuário não encontrado"})
        }
        res.status(200).json(usuarioAtualizado)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deletar = async (req, res) => {
    const {id} = req.params

    try {
        await usuarioService.remover(id)
        res.status(204).json({message: "Usuário removido"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    cadastro,
    listar,
    atualizar,
    deletar
}