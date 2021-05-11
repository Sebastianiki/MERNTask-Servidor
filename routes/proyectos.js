const express = require('express')
const router = express.Router()
const proyectoController = require('../controllers/proyectoController')
const auth = require('../middlewares/auth')
const {check} = require('express-validator')

// api/proyectos

// Crear Proyecto
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto)
// obtener proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos)
// actualizar proyecto por id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto)
// elimina un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto)

    
module.exports = router