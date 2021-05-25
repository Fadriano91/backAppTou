const express = require ('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

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

/**************
 * Lista uma posicao pelo id
 * GET /posicoes/:id
 **************/
 router.get('/:id', async(req,res)=> {
    try{
      const posicao = await Posicao.findById(req.params.id)
      res.json(posicao)
    }catch (err){
        res.status(500).send({
            errors: [{message: `Não foi possível obter a posição com o id
                      ${req.params.id}`}]
        })
    }
})

/**************
 * Inclui uma nova posicao 
 * POST /posicoes
 **************/
const validaPosicao = [
    check("nome", "Nome da Posição é obrigatória").not().isEmpty(),
    check("status", "Informe um status válido para a posição.").isIn(['ativo','inativo'])
]

 router.post('/', validaPosicao, 
    async(req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    //Verifica se a posição já existe
    const { nome } = req.body
    let posicao = await Posicao.findOne({nome})
    if (posicao)
        return res.status(200).json({
            errors: [{message: 'Já existe uma posição com o nome informado!'}]
        })
    try{
        let posicao = new Posicao(req.body)
        await posicao.save()
        res.send(posicao)
    } catch (err){
        return res.status(500).json({
            errors: [{message: `Erro ao salvar a posição: ${err.message}`}]
        })
    }
 })

/**************
 * Remove uma posicao 
 * DELETE /posicoes/:id
 **************/
router.delete('/:id', async (req, res) => {
    await Posicao.findByIdAndRemove(req.params.id)
    .then(posicao => {
        res.send({message: `Posição nome ${posicao.nome} removida com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{message: `Não foi possível apagar a posição com o id ${req.params.id}`}]
        })
    })
})

/**************
 * Edita a posicao 
 * PUT /posicoes
 **************/

router.put('/', validaPosicao,
    async(req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados =req.body
    await Posicao.findByIdAndUpdate(req.body._id, {
        $set: dados
    }, {new: true})
    .then(posicao => {
        res.send({message: `Posição ${posicao.nome} alterado com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{message: 
            `Não foi possível alterar a categoria com o id ${req.body._id}`}]
        })
    })
})

module.exports = router