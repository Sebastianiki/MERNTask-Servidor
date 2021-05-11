const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const authController = require('../controllers/authController')
const auth = require('../middlewares/auth')
// api/auth

// Iniciar Sesion
router.post('/', 
    [
        check('email', 'Ingrese un email valido').isEmail(),
        check('password', 'Tu contraseña debe tener almenos 6 caracteres').isLength({min:6})
    ],
    authController.autenticarUsuario
)

//obten usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado)
module.exports = router