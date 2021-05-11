const Tarea = require('../models/Tareas')
const Proyecto = require('../models/Proyectos') 
const { validationResult } = require('express-validator')

// crear tarea
exports.crearTarea = async(req,res) =>{
    const errors = validationResult(req)
    if( !errors.isEmpty() ) return res.status(400).json({errors : errors.array()})

    
    try{
        const { proyecto } = req.body
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})
        const tarea = new Tarea(req.body)
        await tarea.save()
        res.json({tarea})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// obtener tareas por proyecto
exports.obtenerTareas = async(req,res) =>{
    try{
        const { proyecto } = req.query
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})
        const tareas = await Tarea.find({proyecto})
        res.json({tareas})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// actualizar una tarea
exports.actualizarTarea = async(req,res) =>{
    try{
        const { proyecto, nombre, estado } = req.body
        let tareaExiste = await Tarea.findById(req.params.id)
        if(!tareaExiste) return res.status(404).json({msg: 'Tarea no encontrada'})
        const existeProyecto = await Proyecto.findById(proyecto)
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})

        const nuevaTarea = {}
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        tareaExiste = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new : true})
        res.json({tareaExiste})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}

// elimina una tarea
exports.eliminarTarea = async(req,res) =>{
    try{
        const { proyecto } = req.query
        let tareaExiste = await Tarea.findById(req.params.id)
        if(!tareaExiste) return res.status(404).json({msg: 'Tarea no encontrada'})
        const existeProyecto = await Proyecto.findById(proyecto)
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'No estas autorizado para hacer eso'})
        tareaExiste = await Tarea.findOneAndRemove({_id: req.params.id})
        res.json({msg:'Tarea eliminada con exito'})
    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error')
    }
}