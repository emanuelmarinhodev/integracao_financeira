const investimentosService = require('../services/investimentoService')

const getIndicadores = (req, res) => {
    const dados = investimentosService.buscarIndicadores()

    if(dados.error) {
        return res.status(404).json({message: dados.error})
    }

    res.json(dados)
}



module.exports = {
    getIndicadores,
}