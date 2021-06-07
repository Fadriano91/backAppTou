const express = require ('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Jogador = require('../model/Jogador')
const Posicao = require('../model/Posicao')

/**************
 * Lista todos os jogadores
 * GET /jogadores
 **************/
router.get('/', async(req,res)=> {
    try{
      const jogadores = await Jogador
                              .find({"status":"ativo"})
                              .sort({nome: 1})
                              .populate("posicao", "nome")
      res.json(jogadores)
    }catch (err){
        res.status(500).send({
            errors: [{message: 'Não foi possível obter os jogadores!'}]
        })
    }
})

/**************
 * Lista um jogador pelo id
 * GET /jogadores/:id
 **************/
 router.get('/:id', async(req,res)=> {
    try{
      const jogador = await Jogador.findById(req.params.id)
      res.json(jogador)
    }catch (err){
        res.status(500).send({
            errors: [{message: `Não foi possível obter o jogador com o id
                      ${req.params.id}`}]
        })
    }
})

/**************
 * Lista um jogador pelo id da Posição
 * GET /jogadores/posicoes/:id
 **************/
 router.get('/posicao/:id', async(req,res)=> {
    try{
      const jogadores = await Jogador
                            .find({"posicao":req.params.id})
                            .sort({nome: 1})
                            .populate("posicao", "nome")
      res.json(jogadores)
    }catch (err){
        res.status(500).send({
            errors: [{message: `Não foi possível obter os jogadores com o id
                      da posição ${req.params.id}`}]
        })
    }
})

/**************
 * Inclui um novo jogador 
 * POST /jogadores
 **************/
const validaJogador = [
    check("nome", "Nome do Jogador é obrigatório.").not().isEmpty(),
    check("status", "Informe um status válido para o Jogador.").
          isIn(['ativo','inativo']),
    check("posicao", "Informe uma Posição válida para o Jogador.").not().isEmpty(),
    check("habilidade", "Informe as habilidades do Jogador.").not().isEmpty(),
    check("peBom", "Informe o pé bom do Jogador.").isIn(['direito','esquerdo']),
    check("estrela", "Informe as estrelas do Jogador em número.").
          isNumeric().isFloat({min:0, max:5}).
          withMessage('A estrela deve ser de 0 a 5'),
    check("copa", "Informe quantas Copas o Jogador participou em número.").
          isNumeric().isFloat({min:0, max:5}),

]

 router.post('/', validaJogador, 
    async(req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    //Verifica se o jogador já existe
    const { nome } = req.body
    let jogador = await Jogador.findOne({nome})
    if (jogador)
        return res.status(200).json({
            errors: [{message: 'Já existe um jogador com o nome informado!'}]
        })
    try{
        let jogador = new Jogador(req.body)
        await jogador.save()
        res.send(jogador)
    } catch (err){
        return res.status(500).json({
            errors: [{message: `Erro ao salvar o jogador: ${err.message}`}]
        })
    }
 })

/**************
 * Remove um jogador 
 * DELETE /jogadores/:id
 **************/
router.delete('/:id', async (req, res) => {
    await Jogador.findByIdAndRemove(req.params.id)
    .then(jogador => {
        res.send({message: `Jogador ${jogador.nome} removido com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{message: `Não foi possível apagar o jogador com o id 
                      ${req.params.id}`}]
        })
    })
})

/**************
 * Edita o jogador 
 * PUT /jogadores
 **************/

router.put('/', validaJogador,
    async(req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados =req.body
    await Jogador.findByIdAndUpdate(req.body._id, {
        $set: dados
    }, {new: true})
    .then(jogador => {
        res.send({message: `Jogador ${jogador.nome} alterado com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{message: 
            `Não foi possível alterar o jogador com o id ${req.body._id}`}]
        })
    })
})

module.exports = router