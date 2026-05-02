const investimentoService = require('./investimentoService')
const usuarioService = require('./usuarioService')

const calcularProjecao = async (usuarioId) => {
    //Implementar a busca por usuário por ID
    const usuarios = await usuarioService.buscarTodos()
    const usuario = usuarios.find(usuario => usuario.id === usuarioId)

    if(!usuario) throw new Error("Usuário não encontrado")

    const indicadores = investimentoService.buscarIndicadores()

    const selicAtual = indicadores[indicadores.length -1].selic

    const valorBase = usuario.valor_investimento
    const rendimentoAnual = valorBase * (selicAtual / 100)
    const totalProjetado = valorBase + rendimentoAnual

    return {
        usuario: usuario.nome,
        perfil: usuario.perfil_risco,
        investimento_inicial: valorBase,
        taxa_selic_utilizada: `${selicAtual}%`,
        projecao_1_ano: totalProjetado.toFixed(2),
        recomendacao: usuario.perfil_risco === 'Conservador' ? "Focar em Tesouro Direto (Selic) devido ao baixo risco" : "Considerar diversificação"
    }
}

module.exports = {
    calcularProjecao
}