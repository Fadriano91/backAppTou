const express = require('express')
require('dotenv').config() //Carrega as 'variáveis de ambiente'
const InicializaMongoServer = require('./config/Db')
//Definindo as rotas da aplicação
const rotasPosicao = require('./routes/Posicao')

//Inicializamos o servidor MongoDB
InicializaMongoServer()

const app = express() 
//Porta Defaul
const PORT = process.env.PORT
//Parse conteúdo JSON
app.use(express.json())

app.get('/', (req, res) => {
    res.json({mensagem: "API AppTou 100% funcional! 👏",
              versao: '1.0.1'})
})
/*Rotas da Posição */
app.use('/posicoes', rotasPosicao)

app.listen(PORT, (req,res) => {
    console.log(`Servidor Web iniciado na porta ${PORT}`)
})