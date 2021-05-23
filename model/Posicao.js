const mongoose = require('mongoose')

//Criando o Schema Posicao
const PosicaoSchema = mongoose.Schema({
    nome: {
        type: String,
        unique: true //Criamos um índice único
    },
    status: {
        type: String,
        enum: ['ativo','inativo'],
        default: 'ativo'
    }
},{timestamps: true})

module.exports = mongoose.model('posicao',PosicaoSchema)