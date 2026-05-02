require('dotenv').config()
const express = require('express')
const cors = require('cors')

const investimentoRoutes = require('./routes/investimentoRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', investimentoRoutes)

app.get('/', (req, res)=> {
    res.json({message: 'API do Facilitador de Investimentos Online!'})
})

app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT} 🚀`)
})