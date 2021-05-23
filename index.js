const express = require('express')

const app = express() 
//Porta Defaul
const PORT = 4000
//Parse conteúdo JSON
app.use(express.json())

app.get('/', (req, res) => {
    res.json({mensagem: "API AppTou 100% funcional! 👏",
              versao: '1.0.1'})
})

app.listen(PORT, (req,res) => {
    console.log(`Servidor Web iniciado na porta ${PORT}`)
})