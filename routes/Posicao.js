const express = require ('express')
const router = express.Router()
const Posicao = require('../model/Posicao')

/**************
 * Lista todas as posicoes
 * GET /posicoes
 **************/
router.get('/', async(req,res)=> {
    try{
      const posicoes = await Posicao.find({"status":"ativo"}).sort({nome: 1})
      res.json(posicoes)
    }catch (err){
        res.status(500).send({
            errors: [{message: 'Não foi possível obter as posições!'}]
        })
    }
})

module.exports = router