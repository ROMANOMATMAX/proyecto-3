const express = require('express');
const router = express.Router(); //del modulo express solo requiero el metodo Router para declarar mis rutas
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {addNewUser, checkUserProvided, showAllUsers} = require('../controllers/authentication.controller');
const {userSignUpSchema, userSignInSchema} = require('../middlewares/schemas');
const validateObjectMW = require('../middlewares/validateSchemas');
const validateResourceMW = require('../middlewares/validateSchemas');

//endpoints


//Endpoint que muestra todos los usuarios -solo para Admins
router.get('/all', [verifyTokenMiddleWare, isAdmin],showAllUsers)

//Endpoint que permite registrarse
router.post('/signup', validateResourceMW(userSignUpSchema),addNewUser)

//Endpoint que permite loguearse
router.post('/signin', validateResourceMW(userSignInSchema),checkUserProvided)


module.exports = router;