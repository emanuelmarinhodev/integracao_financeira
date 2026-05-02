const investimentosService = require('../services/investimentoService')
const calculoService = require('../services/calculoService')

const getIndicadores = (req, res) => {
    const dados = investimentosService.buscarIndicadores()

    if(dados.error) {
        return res.status(404).json({message: dados.error})
    }

    res.json(dados)
}

const calcular = async (req, res) => {
    const {id} = req.params

    try {
        const resultado = await calculoService.calcularProjecao(id)
        res.json(resultado)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}



module.exports = {
    getIndicadores,
    calcular
}