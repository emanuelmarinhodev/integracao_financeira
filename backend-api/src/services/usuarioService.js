const supabase = require('./supabase')

const usuarioService = {
    async criar(dados) {
        const {data, error} = await supabase.from('usuarios').insert([dados]).select()

        if(error) throw error

        return data[0]
    },

    async buscarTodos() {
        const {data, error} = await supabase.from('usuarios').select('*')
        if (error) throw error

        return data
    },

    async atualizar(id, dados) {
        const {data, error} = await supabase.from('usuarios').update(dados).eq('id', id).select()
        if (error) throw error

        return data[0]
    },

    async remover(id) {
        const {error} = await supabase.from('usuarios').delete().eq('id', id)
        if (error) throw error

        return {message: 'Usuário removido com sucesso'}
    }
}

module.exports = usuarioService