import pandas as pd
from bcb import sgs
import os

def coletar_indicadores(dicionario_indicadores, data_inicio="2023-01-01"):
    try:
        print(f'Iniciando coleta de: {list(dicionario_indicadores.keys())}')

        df = sgs.get(dicionario_indicadores, start=data_inicio)

        print('Dados baixados com sucesso')
        return df
    except Exception as error:
        print(f'Erro ao coletar dados: {error}')
        return None
    
def tratar_dados(df):
    if df is None or df.empty:
        print('Dataframe vazio ou nulo')
        return pd.DataFrame()
    
    df = df.ffill().bfill()

    df = df.reset_index()
    
    df.columns = ['data' if col.lower() == 'date' else col for col in df.columns]

    for col in df.columns:
        if col != 'data':
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    print('Tratamento concluído: Datas padronizadas e tipos convertidos')
    return df

def salvar_dados(df, nome_arquivo):
    if df.empty:
        print('Não existe dados para salvar')
        return
    pasta_data = os.path.join('data')
    if not os.path.exists(pasta_data):
        os.makedirs(pasta_data)
    
    caminho_json = os.path.join(pasta_data, f'{nome_arquivo}.json')
    caminho_csv = os.path.join(pasta_data, f'{nome_arquivo}.csv')

    df.to_json(caminho_json, orient='records', date_format='iso', indent=4)
    df.to_csv(caminho_csv, index=False)

    print(f'Sucesso! Dados salvos em: \n{caminho_json}\n{caminho_csv}')

if __name__ == "__main__":
    indicadores = {
        'selic': 11,
        'ipca': 433
    }

    dados_brutos = coletar_indicadores(indicadores)
    dados_finais = tratar_dados(dados_brutos)
    salvar_dados(dados_finais, 'indicadores_mercado')

    if not dados_finais.empty:
        print('Resumo dos dados tratados')
        print(dados_finais.head())
        print('=====================\n')