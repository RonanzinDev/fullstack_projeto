# Projeto

# Como Executar o projeto:

## Configurando o banco(MySQL):

**Requisito:**
- Ter o [MySQL](https://www.mysql.com/downloads/) instalado em sua maquina

Na pasta /server contém um arquivo chamado `.env.example` (eu sei que as credenciais do github estão nele) que contém todas as configurações de banco e do github. Crie um arquivo `.env` dentro de /server e cole as configurações de `.env.example` dentro dele. Alterar as configurações do banco conforme as configurações da sua máquina.

## Rodando local:
**Requisitos:**
- Baixar e instalar o [Python](https://www.python.org/downloads/) (OBS: Recomendado a versão 3.10.8)
- Baixar e instalar o [NodeJS](https://nodejs.org/en/) (OBS: Recomendado a versão 14.20)

### Instalando dependencias:
**Server**: 
Entre dentro a pasta /server e execute o comando `pip install -r requirements.py` para instalar os pacotes utilizados no projeto.
**Front**: Entre dentro da pasta /front e execute o comando `npm install`.

### Executando
**Server:** Para executar o server basta rodar o comando `uvicorn main:app` dentro da pasta /server .
<br>

**Front**: Para executar o front basta rodar o comando `npm start` dentro da pasta /front


## Rodando com Docker:

**Requisto**:
- Baixar e instalar o [Docker](https://www.docker.com/products/docker-desktop/)

No projeto contém um arquivo `docker-compose.yml`, confirme se essa configuração do banco dentro do arquivo está igual ao seu `.env` dentro de /server:

`docker-compose`
```js
MYSQL_ROOT_PASSWORD: 'root'
MYSQL_DATABASE: 'webapp'
MYSQL_USER: 'root'
MYSQL_PASSWORD: 'root'
```
``.env``
```js
USER=root
PASSWORD=root
PORT=3306
DB=webapp
```

### Executando
Para executar o projeto basta rodar o comando `docker compose up` no diretório em que o `docker-compose.yml` se encontra.

## Checklist do que foi feito

- [x] Enquanto o usuário não estiver “logado”, apresentar uma página que diga "Olá
visitante"

- [x] Se o usuário estiver “logado”, ao invés da página do "Olá Visitante", apresentar
"Olá {NOME_DO_USUARIO}"

- [x] botão de logout

- [x] botão que leve para a página de edição dos dados cadastrais. Nessa
página apresentar botão de remoção do usuário que o desloga em
seguida.

- [x] Use variáveis de ambiente

- [x]  Use Docker

- [ ] Suba a aplicação(back e front) no heroku ou similar.

- [x] Criar frontend que realize as funcionalidades acima em SPA JS -
React/Vue/Angular/Svelte/sei-la-o-q-mais-estiver-na-moda

- [x] Criar API REST completa para manipulação dos usuários

- [x] Realizar autenticação via token JWT

- [x] Torne o front adaptado para web e mobile.

- [x] Escreva um arquivo de docker-compose contendo a configuração dos 3
serviços(back, banco, front). Torne o banco de dados acessível apenas para o
back.

- [x] Login por github
- [ ] Login por gmail (não o email)
- [x] Login por email, CPF ou PIS + senha
