const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando o schema do Jogador
const JogadorSchema = mongoose.Schema({
    nome: {type:String, unique:true},
    status: {type: String, enum: ['ativo','inativo'], default: 'ativo'},
    foto: {
        originalname: {type: String},
        path: {type: String},
        size: {type: Number},
        mimetype: {type: String}
    },
    posicao: {type:Schema.Types.ObjectId, ref: 'posicao'},
    habilidade: {type: String},
    peBom: {type: String, enum: ['direito', 'esquerdo'], default: 'direito'},
    estrela: {type: Number},
    copa: {type: Number}
},{timestamps:true})
module.exports = mongoose.model('jogador', JogadorSchema)