const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', '..', '..', 'backend-data', 'data', 'indicadores_mercado.json')

const buscarIndicadores = () => {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            return {error: "Arquivo de dados não encontrado"}
        }

        const rawData = fs.readFileSync(DATA_PATH, 'utf-8')
        return JSON.parse(rawData)
    } catch (error) {
        return {error: "Erro ao ler o arquivo de dados"}
    }
}

module.exports = {
    buscarIndicadores
}