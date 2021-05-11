const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) =>{
    const errors = validationResult(req)
    if( !errors.isEmpty() ) return res.status(400).json({errors : errors.array()})

    const {email,password} = req.body
    try{
        let usuario = await Usuario.findOne({ email })
        if(!usuario) return res.status(400).json({msg : 'El usuario no existe'})
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto) return res.status(400).json({msg: 'Password incorrecto'})
        const payload = {
            usuario:{
                id : usuario.id
            }
        }
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 31104000
        }, (error, token) => {
            if(error) throw error
            res.status(200).json({token});
        })
    }catch(error){
        console.log(error)
    }
}

// obten usuario autenticado
exports.usuarioAutenticado = async (req,res) =>{
    try{
        const usuario = await Usuario.findById(req.usuario.id).select('-password ')
        res.json({usuario})
    }catch(error){
        console.log(error)
        res.status(500).json({msg: 'Ocurrio un error'})
    }
}