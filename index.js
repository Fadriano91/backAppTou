const express = require('express')
const cors = require('cors')
require('dotenv').config() //Carrega as 'variáveis de ambiente'
const InicializaMongoServer = require('./config/Db')
//Definindo as rotas da aplicação
const rotasPosicao = require('./routes/Posicao')
const rotasJogador = require('./routes/Jogador')
const rotaUpload = require('./routes/Upload')

//Inicializamos o servidor MongoDB
InicializaMongoServer()

const app = express() 

//Removendo por segurança
app.disable('x-powered-by')

//Porta Defaul
const PORT = process.env.PORT || 4000

//Middleware do Express
app.use(cors())



//Parse conteúdo JSON
app.use(express.json())

app.get('/', (req, res) => {
    res.json({mensagem: "API AppTou 100% funcional! 👏",
              versao: '1.0.2'})
})
/*Rotas da Posição */
app.use('/posicoes', rotasPosicao)
/**/
app.use('/jogadores', rotasJogador)
/* Rotas do conteúdo público */
app.use('/public', express.static('public'))
/*Rota do upload*/
//app.use('/upload', rotaUpload)

/*Rota para trata exceções - 404 (Deve ser a última rota SEMPRE) */
app.use(function(req, res) {
    res.status(404).json({message: `A rota ${req.originalUrl} não existe`})
})

app.listen(PORT, (req,res) => {
    console.log(`Servidor Web iniciado na porta ${PORT}`)
})