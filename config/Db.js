const mongoose = require('mongoose')

const MONGOURI = process.env.MONGODB_URL

const InicializaMongoServer = async () => {
    try{
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true, //Forçamos a utilizar o último parser de URL
            useCreateIndex: true, //Qdo necessário, utilizará a criação de índices,
            useFindAndModify: false, //O padrão é Encontrar os registros e alterar todos
            useUnifiedTopology: true //Utilizamos a engine para a descoberta de servidores
        })
        console.log("Conectado ao MongoDB!!")
    } catch (e){
        console.error(e)
        throw e //'explodirá' os detalhes do erro
    }
}

module.exports = InicializaMongoServer