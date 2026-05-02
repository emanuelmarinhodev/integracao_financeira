import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
  const [indicadores, setIndicadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    axios.get('http://localhost:3000/api/indicadores')
        .then(response => {
          setIndicadores(response.data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Erro ao buscar dados da API', error)
          setLoading(false)
        })
  }, [])

  return(
    <div style={{padding: '20px', fontFamily: 'sans-serif'}}>
      <h1>📊 Facilitador de Investimentos</h1>
      <p>Dados integrados diretamente do Banco Central via Python & Node.js</p>

      { loading ? <p>Carregando dados...</p> : (
        <table border={1} cellPadding={10} style={{borderCollapse: 'collapse',width: '100%'}}>
          <thead>
            <tr style={{backgroundColor: '#f4f4f4'}}>
              <th>Data</th>
              <th>Selic (%)</th>
              <th>IPCA (%)</th>
            </tr>
          </thead>
          <tbody>
            {indicadores.slice(-10).map((item, index)=> (
              <tr key={index}>
                <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                <td>{item.selic.toFixed(4)}</td>
                <td>{item.ipca.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
      }
    </div>
  )
}

export default App