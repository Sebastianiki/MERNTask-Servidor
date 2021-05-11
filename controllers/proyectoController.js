const Proyecto = require('../models/Proyectos') 
const { validationResult } = require('express-validator')

// crearProyecto
exports.crearProyecto = async (req,res) =>{
    const errors = validationResult(req)
    if( !errors.isEmpty() ) return res.status(400).json({errors : errors.array()})
    
    try{
        const proyecto = await new Proyecto(req.body)
        proyecto.creador = req.usuario.id
        proyecto.save()
        res.json(proyecto)
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// obtener proyectos
exports.obtenerProyectos = async (req,res) =>{
    try{
        const proyectos = await Proyecto.find({ creador : req.usuario.id })
        res.json({proyectos})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// actualiza proyecto por su id
exports.actualizarProyecto = async (req,res) =>{
    const errors = validationResult(req)
    if( !errors.isEmpty() ) return res.status(400).json({errors : errors.array()})

    const {nombre} = req.body
    const nuevoProyecto = {}

    if(nombre) nuevoProyecto.nombre = nombre

    try{
        let proyecto = await Proyecto.findById(req.params.id)
        if(!proyecto) return res.status(404).json({msg:'Proyecto no encontrado'})
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})
        proyecto = await Proyecto.findOneAndUpdate({_id:req.params.id}, { $set: nuevoProyecto}, {new: true})
        res.json({proyecto})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// elimina proyecto por su id
exports.eliminarProyecto = async (req,res) =>{
    try{
        let proyecto = await Proyecto.findById(req.params.id)
        if(!proyecto) return res.status(404).json({msg:'Proyecto no encontrado'})
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})
        await Proyecto.findOneAndRemove({ _id : req.params.id})
        res.json({msg: 'Proyecto Eliminado'})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}