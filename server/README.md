# Executando o projeto

## Executando com python

### Requisitos:
* Ter o python instalado
* O banco MySQL instalado

Clone o projeto em sua maquina, depois rode o comando `pip install -r requirements.txt` para instalar os pacotes usados neste projeto.


#### Configurando .env
No projeto contem um arquivo chamado `.env.example` nele contem as variaveis de ambiente necessarias para rodar o projeto. Os campos `USER` e o `PASSWORD` estão vazios pois precisa ser conforme o usuario e senha do banco da sua maquina, então crie um arquivo chamado `.env`, copie e cole as configurações do `.env.exemple` para o `.env` e preencha os campos em vazio.

OBS: É necessario criar o banco de dados no MySQL primeiro antes de rodar o projeto.
    
Agora basta rodar o comando `uvicorn main:app` para executar o projeto.

## Rodando com Docker
### Requisitos:
* Ter o docker instalado

#### Configurando o .env
É a mesma configuração citada antes, e não precisa criar banco nenhum pois o docker ja faz isso

Clone o repositorio em sua maquina e rode o comando `docker compose up` (em alguns computadores pode ser `docker-compose up`), e pronto o projeto irá executar em sua maquina.

