const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

let supabase = null

if (url && key) {
  supabase = createClient(url, key)
} else {
  console.warn('Supabase não configurado. Usando armazenamento local em memória para usuários.')
}

module.exports = supabase
