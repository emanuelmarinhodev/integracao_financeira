# 📊 Facilitador de Investimentos

Aplicação simples para facilitar a análise de investimentos a partir de dados públicos do Banco Central.  
O sistema coleta, trata e apresenta informações financeiras de forma simplificada para auxiliar a tomada de decisão do usuário.

---

## 🚀 Visão Geral

A aplicação é composta por:

- **Python** → coleta e tratamento de dados da API do Banco Central  
- **Node.js** → API principal e integração dos dados  
- **React** → interface simples com dashboard e gráficos  

O objetivo é transformar dados complexos em informações claras e úteis.

---

## ✅ Requisitos Funcionais

- RF01: Consumir dados da API pública do Banco Central  
- RF02: Realizar tratamento e simplificação dos dados financeiros  
- RF03: Fornecer dados processados para a API em Node.js  
- RF04: Receber dados do usuário (perfil financeiro, valor de investimento, etc.)  
- RF05: Integrar dados do usuário com dados tratados  
- RF06: Retornar recomendações ou indicadores de investimento  
- RF07: Exibir informações em um frontend React  
- RF08: Apresentar dados em formato visual (gráficos e dashboard)  

---

## ⚙️ Requisitos Não Funcionais

- RNF01: Aplicação deve ter resposta rápida (baixo tempo de carregamento)  
- RNF02: Código deve ser simples e de fácil manutenção  
- RNF03: APIs devem seguir padrão REST  
- RNF04: Sistema deve ser escalável para futuras melhorias  
- RNF05: Interface deve ser responsiva e de fácil uso  
- RNF06: Separação clara entre backend, processamento e frontend  
- RNF07: Tratamento básico de erros nas requisições  

---

## 📏 Regras de Negócio

- RN01: Os dados utilizados devem ser exclusivamente da API pública do Banco Central  
- RN02: Os cálculos devem ser simplificados para fácil entendimento do usuário  
- RN03: O perfil do usuário deve influenciar os resultados apresentados  
- RN04: O valor informado para investimento deve impactar os cálculos e projeções  
- RN05: O sistema não realiza investimentos, apenas sugere e informa  
- RN06: As informações exibidas não substituem aconselhamento financeiro profissional  
- RN07: Os dados devem ser sempre atualizados a partir da fonte oficial  

---

## 🛠️ Tecnologias Utilizadas

- Python
- Node.js
- React
- API do Banco Central

---

## 📌 Observação

Este projeto tem caráter educativo e demonstrativo, com foco em simplificação de dados financeiros.
