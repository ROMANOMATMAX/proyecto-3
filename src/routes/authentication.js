const express = require('express');
const router = express.Router(); //del modulo express solo requiero el metodo Router para declarar mis rutas
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {addNewUser, checkUserProvided, showAllUsers} = require('../controllers/authentication.controller');

//endpoints


//Endpoint que muestra todos los usuarios -solo para Admins
router.get('/all', [verifyTokenMiddleWare, isAdmin],showAllUsers)

//Endpoint que permite registrarse
router.post('/signup', addNewUser)

//Endpoint que permite loguearse
router.post('/signin', checkUserProvided)


module.exports = router;